import { createBackendServer } from "../http/createBackendServer.js";

const port = Number(process.env.PORT ?? "4854");
const host = process.env.DESIGNER_BIND_HOST ?? "127.0.0.1";
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new Error("Invalid PORT");
const server = createBackendServer();
server.http.listen(port, host, () =>
  console.error("[Designer backend] HTTP MCP and WebSocket ready"),
);
server.http.on("error", () => {
  console.error("[Designer backend] Listener failed");
  process.exitCode = 1;
  void server.close();
});
const shutdown = () => {
  void server.close().catch(() => {
    process.exitCode = 1;
  });
};
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
