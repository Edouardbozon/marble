import { HttpMiddlewareEffect, HttpStatus, HttpError } from '@marblejs/core';
import { Store } from './rate-limit.in-memory-store';
import { tap, switchMap } from 'rxjs/operators';
import { iif, of, throwError } from 'rxjs';

export interface RateLimitOpts {
  /**
   * Maximum number of connections during ttl window
   */
  threshold: number;

  /**
   * How long to keep records of requests in memory (in seconds)
   */
  window: number;
}

const DEFAULT_OPTS: RateLimitOpts = {
  threshold: 50,
  window: 60 * 60 // 1 hour
};

export const rateLimit$ = (
  opts: RateLimitOpts = DEFAULT_OPTS
): HttpMiddlewareEffect => req$ => {
  if (opts.window < 0) {
    throw new Error('Invalid window option must be greater than 0');
  }
  if (opts.threshold < 0) {
    throw new Error('Invalid threshold option must be greater than 0');
  }

  const inMemoryStore = new Store(opts.threshold, opts.window);

  return req$.pipe(
    switchMap(req =>
      iif(
        () =>
          !!req.connection.remoteAddress &&
          inMemoryStore.check(req.connection.remoteAddress),
        of(req),
        throwError(
          new HttpError(
            'Too many requests, please try again later.',
            HttpStatus.TOO_MANY_REQUESTS
          )
        )
      )
    )
  );
};
