import { randomUUID } from "node:crypto";
import type { WebSocket } from "ws";
import { z } from "zod";

const clientSchema = z.string().uuid();
const replySchema = z
  .object({
    type: z.literal("response"),
    requestId: z.string().uuid(),
    result: z.unknown().optional(),
    error: z.string().min(1).max(1000).optional(),
  })
  .refine(
    (reply) => reply.result !== undefined || reply.error !== undefined,
    "Missing result/error",
  );
const MAX_CLIENTS = 256;
const MAX_PENDING = 512;
const MAX_CLIENT_PENDING = 16;
const REQUEST_TIMEOUT_MS = 15000;

export const createConnectionRegistry = () => {
  const clients = new Map<string, WebSocket>();
  const pending = new Map<
    string,
    {
      socket: WebSocket;
      finish: (value: unknown, error?: string) => void;
    }
  >();
  let isClosing = false;

  const disconnect = (
    socket: WebSocket,
    reason = "CLIENT_DISCONNECTED: outcome may be unknown; inspect before retrying",
  ) => {
    for (const [id, current] of clients) {
      if (current === socket) clients.delete(id);
    }
    for (const entry of [...pending.values()]) {
      if (entry.socket === socket) entry.finish(undefined, reason);
    }
  };

  const register = (input: unknown, socket: WebSocket) => {
    const clientId = clientSchema.parse(input);
    if (isClosing) throw new Error("SERVER_CLOSING");
    if (clients.has(clientId)) throw new Error("CLIENT_ALREADY_CONNECTED");
    if (clients.size >= MAX_CLIENTS) throw new Error("SERVER_BUSY");
    clients.set(clientId, socket);
  };

  const receive = (socket: WebSocket, input: unknown) => {
    const reply = replySchema.parse(input);
    const entry = pending.get(reply.requestId);
    // A response is owned by its registered socket, never by a supplied clientId.
    if (entry?.socket === socket) entry.finish(reply.result, reply.error);
  };

  const request = (
    clientId: string,
    operation: string,
    args: unknown,
    signal?: AbortSignal,
  ) => {
    clientSchema.parse(clientId);
    const socket = clients.get(clientId);
    if (isClosing) return Promise.reject(new Error("SERVER_CLOSING"));
    if (!socket || socket.readyState !== 1)
      return Promise.reject(new Error("CLIENT_OFFLINE"));
    if (signal?.aborted) return Promise.reject(new Error("REQUEST_CANCELLED"));
    if (
      pending.size >= MAX_PENDING ||
      [...pending.values()].filter((entry) => entry.socket === socket).length >=
        MAX_CLIENT_PENDING
    ) {
      return Promise.reject(new Error("SERVER_BUSY"));
    }
    return new Promise<unknown>((resolve, reject) => {
      const requestId = randomUUID();
      const handleAbort = () =>
        finish(undefined, "REQUEST_CANCELLED: mutation outcome may be unknown");
      const timer = setTimeout(
        () =>
          finish(
            undefined,
            "CLIENT_TIMEOUT: mutation outcome may be unknown; reuse requestId to inspect",
          ),
        REQUEST_TIMEOUT_MS,
      );
      const finish = (value: unknown, error?: string) => {
        if (!pending.delete(requestId)) return;
        if (error && socket.readyState === 1) {
          socket.send(JSON.stringify({ type: "cancel", requestId }));
        }
        clearTimeout(timer);
        signal?.removeEventListener("abort", handleAbort);
        if (error) reject(new Error(error));
        else resolve(value);
      };
      pending.set(requestId, { socket, finish });
      signal?.addEventListener("abort", handleAbort, { once: true });
      socket.send(
        JSON.stringify({ type: "request", requestId, operation, args }),
        (error) => {
          if (error) finish(undefined, "CLIENT_DISCONNECTED");
        },
      );
    });
  };

  const close = () => {
    isClosing = true;
    for (const socket of clients.values()) {
      disconnect(socket, "SERVER_CLOSING: inspect outcome before retrying");
      socket.close(1001, "Server restarting");
    }
  };

  return {
    register,
    receive,
    disconnect,
    request,
    close,
    getCounts: () => ({ clients: clients.size, pending: pending.size }),
  };
};

export type ConnectionRegistry = ReturnType<typeof createConnectionRegistry>;
