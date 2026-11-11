import { randomUUID } from 'node:crypto';
import type { Browser } from 'playwright';

import { getRenderUrl } from './getRenderUrl.js';
import { loadRenderPage } from './loadRenderPage.js';
import { getRenderMeasurements } from './measurements.js';
import { restrictRenderRequests } from './restrictRenderRequests.js';

const RENDER_TIMEOUT_MS = 20000;
const MAX_RENDER_MEGABYTES = 8;
const BYTES_PER_KIBIBYTE = 1024;

export { getRenderUrl } from './getRenderUrl.js';

let isCapturing = false;

export const captureFrame = async (
  snapshot: { document: unknown; flowId: string; createdAt: number },
  width: number,
  height: number,
  signal?: AbortSignal,
) => {
  signal?.throwIfAborted();
  const url = getRenderUrl();

  if (isCapturing) {
    throw new Error('Renderer busy; retry after the current capture completes');
  }

  isCapturing = true;

  let browser: Browser | undefined;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  const handleAbort = () => { void browser?.close().catch(() => undefined); };
  signal?.addEventListener('abort', handleAbort, { once: true });

  try {
    const { chromium } = await import('playwright').catch(() => {
      throw new Error(
        'Playwright is unavailable. Use the existing repository development installation; no package was installed automatically.',
      );
    });

    browser = await chromium.launch({ headless: true, timeout: 10_000 });

    signal?.throwIfAborted();

    deadline = setTimeout(() => {
      void browser?.close().catch(() => undefined);
    }, RENDER_TIMEOUT_MS);

    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      serviceWorkers: 'block',
    });

    const statistics = { blockedRequests: 0 };

    await restrictRenderRequests(context, url.origin, statistics);

    const id = randomUUID();

    await context.addInitScript(
      ({ id, snapshot, origin }) => {
        if (location.origin === origin) {
          sessionStorage.setItem(`designer-preview-session:${id}`, JSON.stringify(snapshot));
        }
      },
      { id, snapshot, origin: url.origin },
    );

    const page = await context.newPage();

    url.hash = `/render/${id}`;
    await loadRenderPage(page, url.href);

    const png = await page.screenshot({
      type: 'png',
      fullPage: false,
      animations: 'disabled',
      timeout: 5_000,
    });

    const measurements = await getRenderMeasurements(page);

    if (png.length > MAX_RENDER_MEGABYTES * BYTES_PER_KIBIBYTE * BYTES_PER_KIBIBYTE) {
      throw new Error('Render image exceeds 8 MiB; request a smaller viewport');
    }

    return { png, measurements, blockedRequests: statistics.blockedRequests };
  } finally {
    signal?.removeEventListener('abort', handleAbort);
    if (deadline) {
      clearTimeout(deadline);
    }

    await browser?.close().catch(() => undefined);
    isCapturing = false;
  }
};
