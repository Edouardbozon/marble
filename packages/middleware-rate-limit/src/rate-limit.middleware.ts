import { HttpError, HttpMiddlewareEffect, HttpStatus } from '@marblejs/core';
import { iif, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MemoryStore } from './rate-limit.in-memory-store';

export interface RateLimitOpts {
  /**
   * Maximum number of connections during ttl window
   */
  threshold?: number;

  /**
   * How long in milliseconds to keep records of requests in memory
   */
  ttl?: number;

  /**
   * Custom message when limit reached
   */
  message?: string;
}

type Required<T> =
  T extends object
    ? { [P in keyof T]-?: NonNullable<T[P]>; }
    : T;

const DEFAULT_OPTS: RateLimitOpts = {
  threshold: Infinity,
  ttl: 86400000,
  message: 'Too many requests',
};

const store = new MemoryStore();

export const rateLimit$ = (
  opts: RateLimitOpts = {}
): HttpMiddlewareEffect => req$ => {
  const options = { ...DEFAULT_OPTS, ...opts } as Required<RateLimitOpts>;

  if (options.ttl < 0) {
    throw new Error('Invalid ttl option must be greater than 0');
  }
  if (options.threshold < 0) {
    throw new Error('Invalid threshold option must be greater than 0');
  }

  store.start(options.threshold, options.ttl);

  return req$.pipe(
    switchMap(req =>
      iif(
        () =>
          !!req.connection.remoteAddress &&
          store.check(req.connection.remoteAddress),
        of(req),
        throwError(
          new HttpError(
            options.message,
            HttpStatus.TOO_MANY_REQUESTS
          )
        )
      )
    )
  );
};
