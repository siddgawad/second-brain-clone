// src/logger.ts
import pino from 'pino';
import { IS_PROD, LOG_LEVEL } from './env';

export const logger = IS_PROD
  ? pino({ level: LOG_LEVEL })
  : pino({
      level: LOG_LEVEL,
      transport: {
        target: 'pino-pretty'
      }
    });
