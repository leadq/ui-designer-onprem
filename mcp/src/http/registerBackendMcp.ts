import { randomUUID } from 'node:crypto';
import type { Express } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

import type { ConnectionRegistry } from '../backend/registry.js';
import { registerBackendTools } from '../backend/registerTools.js';
import { registerDesignerTools } from '../designer/tools.js';

const MAX_SESSIONS = 256;
const MAX_REQUESTS = 512;
const IDLE_MS = 30 * 60 * 1000;

type RequestId = string | number;
interface Session {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  requests: Map<RequestId, AbortController>;
  lifetime: AbortController;
  touched: number;
}

// Transport sessions scope MCP cancellation, never browser identity or design state.
export const registerBackendMcp = (app: Express, registry: ConnectionRegistry) => {
  const sessions = new Map<string, Session>();
  const allSessions = new Set<Session>();
  let isClosing = false;
  let activeRequests = 0;
  const closeSession = async (session: Session) => {
    allSessions.delete(session);
    if (session.transport.sessionId) sessions.delete(session.transport.sessionId);
    session.lifetime.abort();
    for (const abort of session.requests.values()) abort.abort();
    await session.server.close();
  };
  const sweep = setInterval(() => {
    for (const session of allSessions) {
      if (!session.requests.size && Date.now() - session.touched > IDLE_MS)
        void closeSession(session).catch(() => {});
    }
  }, 60000);
  sweep.unref();

  app.all('/mcp', async (req, res) => {
    if (isClosing || activeRequests >= MAX_REQUESTS) {
      res.status(503).json({ error: 'SERVER_BUSY' });
      return;
    }
    if (!['POST', 'DELETE'].includes(req.method)) {
      res.status(405).set('Allow', 'POST, DELETE').end();
      return;
    }
    if (Array.isArray(req.body)) {
      res.status(400).json({ error: 'MCP_BATCH_UNSUPPORTED' });
      return;
    }
    const sessionId = req.get('mcp-session-id');
    let session = sessionId ? sessions.get(sessionId) : undefined;
    if (sessionId && !session) {
      res.status(404).json({ error: 'MCP_SESSION_EXPIRED' });
      return;
    }
    if (!session && (req.method !== 'POST' || !isInitializeRequest(req.body))) {
      res.status(400).json({ error: 'MCP_INITIALIZE_REQUIRED' });
      return;
    }
    if (!session && allSessions.size >= MAX_SESSIONS) {
      res.status(503).json({ error: 'SERVER_BUSY' });
      return;
    }
    activeRequests += 1;
    const abort = new AbortController();
    const requestId: RequestId | undefined = req.body?.id;
    let isRegisteredRequest = false;
    const handleRequestAbort = () => {
      if (session && isRegisteredRequest) {
        // The SDK suppresses responses after cancellation. Settle its JSON HTTP stream
        // explicitly so cancelled requests cannot retain listener/session resources.
        void session.transport.send({ jsonrpc: '2.0', id: requestId!, error: {
          code: -32800, message: 'REQUEST_CANCELLED: inspect mutation outcome',
        } }).catch(() => {});
      }
    };
    abort.signal.addEventListener('abort', handleRequestAbort, { once: true });
    try {
      if (!session) {
        const server = new McpServer({ name: 'ui-designer-backend', version: '1.0.0' });
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: randomUUID,
          enableJsonResponse: true,
          onsessioninitialized: (id) => { sessions.set(id, created); },
        });
        const created: Session = { server, transport, requests: new Map(), lifetime: new AbortController(), touched: Date.now() };
        session = created;
        allSessions.add(created);
        await registerDesignerTools(server);
        registerBackendTools(server, registry, (extra) => {
          const request = created.requests.get(extra.requestId);
          if (request) {
            const handleCancel = () => request.abort();
            extra.signal.addEventListener('abort', handleCancel, { once: true });
            request.signal.addEventListener('abort', () => extra.signal.removeEventListener('abort', handleCancel), { once: true });
          }
          return AbortSignal.any([extra.signal, created.lifetime.signal, request?.signal ?? created.lifetime.signal]);
        });
        await server.connect(transport);
      }
      session.touched = Date.now();
      if (res.destroyed) return;
      if (req.body?.method === 'notifications/cancelled') {
        session.requests.get(req.body?.params?.requestId)?.abort();
      }
      if (requestId !== undefined) {
        if (session.requests.has(requestId)) {
          res.status(409).json({ error: 'DUPLICATE_MCP_REQUEST' });
          return;
        }
        session.requests.set(requestId, abort);
        isRegisteredRequest = true;
      }
      res.on('close', () => { if (!res.writableEnded) abort.abort(); });
      await session.transport.handleRequest(req, res, req.body);
      if (req.method === 'DELETE') await closeSession(session);
    } catch {
      if (!res.headersSent) res.status(500).json({ error: 'MCP_REQUEST_FAILED' });
    } finally {
      abort.signal.removeEventListener('abort', handleRequestAbort);
      abort.abort();
      activeRequests -= 1;
      if (session) {
        if (isRegisteredRequest) session.requests.delete(requestId!);
        session.touched = Date.now();
        if (!session.transport.sessionId) await closeSession(session);
      }
    }
  });
  const close = async () => {
    isClosing = true;
    clearInterval(sweep);
    await Promise.all([...allSessions].map(closeSession));
  };
  return { close, getCounts: () => ({ mcpSessions: allSessions.size, mcpRequests: activeRequests }) };
};
