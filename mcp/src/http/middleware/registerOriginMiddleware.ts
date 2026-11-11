import cors from 'cors';
import type { Express } from 'express';

const HTTP_FORBIDDEN = 403;

const EXTRA_ALLOWED_ORIGINS = new Set(
  (process.env.DESIGNER_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

export const isAllowedOrigin = (origin: string): boolean => {
  if (EXTRA_ALLOWED_ORIGINS.has(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);

    return (
      url.protocol === 'http:' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
      url.username === '' &&
      url.password === ''
    );
  } catch {
    return false;
  }
};

export const registerOriginMiddleware = (app: Express): void => {
  app.use(
    cors({
      exposedHeaders: ['mcp-session-id'],
      origin: (origin, callback) => {
        callback(null, !origin || isAllowedOrigin(origin));
      },
    }),
  );

  app.use((req, res, next) => {
    const origin = req.get('origin');

    if (origin && !isAllowedOrigin(origin)) {
      res.status(HTTP_FORBIDDEN).json({ error: 'Origin not allowed' });

      return;
    }

    next();
  });
};
