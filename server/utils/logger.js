import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';
const { combine, timestamp, printf } = format;

export const logger = () => {
  const rTracerFormat = printf((info) => {
    const rid = rTracer.id();
    return rid ? `${info.timestamp} [request-id:${rid}]: ${info.message}` : `${info.timestamp}: ${info.message}`;
  });
  return createLogger({
    format: combine(timestamp(), rTracerFormat),
    transports: [new transports.Console()]
  });
};
