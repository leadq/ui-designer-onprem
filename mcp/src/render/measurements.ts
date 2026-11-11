import type { Page } from 'playwright';

/** Coordinates are CSS pixels in the returned viewport image, without canvas zoom. */
export const getRenderMeasurements = async (page: Page) =>
  await page.evaluate(() => {
    const MEASUREMENT_PRECISION = 100;
    const MAX_MEASURED_NODES = 500;

    const viewport = document.getElementById('preview-scroll-container');

    if (!viewport) {
      throw new Error('Render preview viewport missing');
    }

    const getRound = (value: number) =>
      Math.round(value * MEASUREMENT_PRECISION) / MEASUREMENT_PRECISION;

    const occurrences = new Map<string, number>();

    const nodes = [...document.querySelectorAll<HTMLElement>('[data-node-id]')].flatMap(
      (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);

        if (
          !rect.width ||
          !rect.height ||
          style.visibility === 'hidden' ||
          style.display === 'none'
        ) {
          return [];
        }

        const nodeId = element.dataset.nodeId!;
        const occurrence = (occurrences.get(nodeId) ?? 0) + 1;

        occurrences.set(nodeId, occurrence);

        return [
          {
            nodeId,
            occurrence,
            bounds: {
              x: getRound(rect.x),
              y: getRound(rect.y),
              width: getRound(rect.width),
              height: getRound(rect.height),
            },
            outsideViewport:
              rect.left < -1 ||
              rect.top < -1 ||
              rect.right > innerWidth + 1 ||
              rect.bottom > innerHeight + 1,
            scrollOverflow: {
              x: element.scrollWidth > element.clientWidth + 1,
              y: element.scrollHeight > element.clientHeight + 1,
            },
            overflowBehavior: { x: style.overflowX, y: style.overflowY },
            layout: {
              display: style.display,
              direction: style.flexDirection,
              gap: style.gap,
              padding: style.padding,
            },
          },
        ];
      },
    );

    return {
      viewport: { width: innerWidth, height: innerHeight },
      content: { width: viewport.scrollWidth, height: viewport.scrollHeight },
      horizontalOverflow: viewport.scrollWidth > viewport.clientWidth + 1,
      verticalScroll: viewport.scrollHeight > viewport.clientHeight + 1,
      nodes: nodes.slice(0, MAX_MEASURED_NODES),
      nodeCount: nodes.length,
      truncated: nodes.length > MAX_MEASURED_NODES,
      fontsReady: document.fonts.status === 'loaded',
      incompleteImages: [...document.images].filter(
        (image) => !image.complete || image.naturalWidth === 0,
      ).length,
    };
  });
