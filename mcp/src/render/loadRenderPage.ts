import type { Page } from 'playwright';

const MAX_RENDER_ERROR_LENGTH = 300;

export const loadRenderPage = async (page: Page, url: string): Promise<void> => {
  const errors: string[] = [];

  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: 'load', timeout: 10_000 });
  await page.locator('[data-render-capture="ready"]').waitFor({ timeout: 5_000 });

  await page
    .waitForFunction(
      () =>
        document.fonts.status === 'loaded' && [...document.images].every((image) => image.complete),
      {},
      { timeout: 2_000 },
    )
    .catch(() => undefined);

  await page.evaluate(async () => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });

  if (errors.length) {
    throw new Error(`Preview render failed: ${errors[0].slice(0, MAX_RENDER_ERROR_LENGTH)}`);
  }
};
