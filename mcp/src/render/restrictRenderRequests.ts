import type { BrowserContext } from 'playwright';

export const restrictRenderRequests = async (
  context: BrowserContext,
  origin: string,
  statistics: { blockedRequests: number },
): Promise<void> => {
  await context.route('**/*', async (route) => {
    const request = route.request();
    const target = new URL(request.url());

    if (request.method() === 'GET' && target.origin === origin) {
      await route.continue();
    } else {
      statistics.blockedRequests++;
      await route.abort();
    }
  });
};
