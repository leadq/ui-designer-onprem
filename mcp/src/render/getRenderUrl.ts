export const getRenderUrl = (): URL => {
  const configured = process.env.DESIGNER_RENDER_URL;

  if (!configured) {
    throw new Error(
      "Set DESIGNER_RENDER_URL to the running local Designer URL (for example http://127.0.0.1:5173). Render requires this repository Playwright/Chromium installation.",
    );
  }

  const url = new URL(configured);

  const isLocal =
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(url.hostname);
  const approvedOrigins = (process.env.DESIGNER_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim());
  const isApprovedFrontend =
    url.protocol === "https:" && approvedOrigins.includes(url.origin);

  if (
    !(isLocal || isApprovedFrontend) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "DESIGNER_RENDER_URL must be a local HTTP Designer URL or explicitly approved HTTPS frontend, without credentials, query or hash",
    );
  }

  return url;
};
