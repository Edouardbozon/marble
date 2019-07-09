import { HttpError, HttpMiddlewareEffect, HttpStatus } from '@marblejs/core';
import { iif, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MemoryStore } from './rate-limit.in-memory-store';

export interface RateLimitOpts {
  /**
   * Maximum number of connections during ttl window
   */
  threshold: number;

  /**
   * How long in milliseconds to keep records of requests in memory
   */
  ttl: number;
}

const DEFAULT_OPTS: RateLimitOpts = {
  threshold: Infinity,
  ttl: 86400000, // one day
};

const store = new MemoryStore();

export const rateLimit$ = (
  opts: RateLimitOpts = DEFAULT_OPTS
): HttpMiddlewareEffect => req$ => {
  if (opts.ttl < 0) {
    throw new Error('Invalid ttl option must be greater than 0');
  }
  if (opts.threshold < 0) {
    throw new Error('Invalid threshold option must be greater than 0');
  }

  store.start(opts.threshold, opts.ttl);

  return req$.pipe(
    switchMap(req =>
      iif(
        () =>
          !!req.connection.remoteAddress &&
          store.check(req.connection.remoteAddress),
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
