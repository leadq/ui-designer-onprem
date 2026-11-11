import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { z } from "zod";

import { createConnectionRegistry } from "../backend/registry.js";
import { registerBackendMcp } from "./registerBackendMcp.js";
import {
  registerOriginMiddleware,
  isAllowedOrigin,
} from "./middleware/registerOriginMiddleware.js";

const MAX_FRAME_BYTES = 16 * 1024 * 1024;
const HEARTBEAT_MS = 15000;
const REGISTER_TIMEOUT_MS = 5000;

export const createBackendServer = () => {
  const registry = createConnectionRegistry();
  const app = express();
  registerOriginMiddleware(app);
  app.use(express.json({ limit: "2mb" }));
  const http = createServer(app);
  const ws = new WebSocketServer({
    noServer: true,
    maxPayload: MAX_FRAME_BYTES,
    perMessageDeflate: false,
  });
  const sockets = new Set<import("ws").WebSocket>();
  const mcp = registerBackendMcp(app, registry);
  let isClosing = false;

  app.get("/health", (_req, res) =>
    res
      .status(isClosing ? 503 : 200)
      .json({ status: isClosing ? "closing" : "ok", ...registry.getCounts(), ...mcp.getCounts() }),
  );
  app.use(
    (
      _error: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      void next; // Express recognizes error middleware by its four-argument signature.
      res.status(400).json({ error: "INVALID_REQUEST" });
    },
  );

  http.on("upgrade", (req, socket, head) => {
    // Browser registration must not expose the capability in URLs.
    if (
      isClosing ||
      req.url !== "/ws" ||
      !req.headers.origin ||
      !isAllowedOrigin(req.headers.origin)
    ) {
      socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
      return;
    }
    ws.handleUpgrade(req, socket, head, (client) =>
      ws.emit("connection", client),
    );
  });
  ws.on("connection", (socket) => {
    if (sockets.size >= 256) {
      socket.close(1013, "Server busy");
      return;
    }
    sockets.add(socket);
    let isRegistered = false;
    let isAlive = true;
    const timer = setTimeout(() => socket.terminate(), REGISTER_TIMEOUT_MS);
    socket.on("pong", () => {
      isAlive = true;
    });
    const heartbeat = setInterval(() => {
      if (!isAlive) {
        socket.terminate();
        return;
      }
      isAlive = false;
      socket.ping();
    }, HEARTBEAT_MS);
    socket.on("message", (data, isBinary) => {
      try {
        if (isBinary) throw new Error("INVALID_MESSAGE");
        const message: unknown = JSON.parse(data.toString());
        if (!isRegistered) {
          const parsed = z
            .object({
              type: z.literal("register"),
              protocol: z.literal(1),
              clientId: z.string().uuid(),
            })
            .parse(message);
          registry.register(parsed.clientId, socket);
          isRegistered = true;
          clearTimeout(timer);
          socket.send(JSON.stringify({ type: "registered", protocol: 1 }));
        } else registry.receive(socket, message);
      } catch (error) {
        const code =
          error instanceof Error && error.message === "CLIENT_ALREADY_CONNECTED"
            ? "CLIENT_ALREADY_CONNECTED"
            : "INVALID_MESSAGE";
        socket.send(JSON.stringify({ type: "error", code }));
        socket.close(1008, code);
      }
    });
    socket.on("error", () => registry.disconnect(socket));
    socket.on("close", () => {
      clearTimeout(timer);
      clearInterval(heartbeat);
      sockets.delete(socket);
      registry.disconnect(socket);
    });
  });

  const close = async () => {
    if (isClosing) return;
    isClosing = true;
    const closingMcp = mcp.close();
    registry.close();
    const deadline = setTimeout(() => {
      for (const socket of sockets) socket.terminate();
      http.closeAllConnections();
    }, 1000);
    await Promise.all([
      closingMcp,
      new Promise<void>((resolve) => ws.close(() => resolve())),
      new Promise<void>((resolve) => http.close(() => resolve())),
    ]);
    clearTimeout(deadline);
  };
  return { http, registry, close };
};
