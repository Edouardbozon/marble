import { HttpMiddlewareEffect } from '@marblejs/core';

export interface RateLimitOpts {
  threshold: number;
  ttl: number;
}

const DEFAULT_OPTS: RateLimitOpts = {
  threshold: 200,
  ttl: 60 * 60
};

export const rateLimit$ = (
  opts: RateLimitOpts = DEFAULT_OPTS
): HttpMiddlewareEffect => (req$) => {
  if (opts.ttl < 0) {
    throw new Error('Invalid ttl option must be greater than 0');
  }
  if (opts.threshold < 0) {
    throw new Error('Invalid threshold option must be greater than 0');
  }

  return req$.pipe();
};
