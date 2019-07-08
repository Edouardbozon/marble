import { rateLimit$ } from '../rate-limit.middleware';

describe('rateLimit$', () => {
  it('should throw for invalid threshold option', () => {
    const opts = { threshold: -1, ttl: 200 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError('Invalid threshold option must be greater than 0');
  });

  it('should throw for invalid ttl option', () => {
    const opts = { threshold: 200, ttl: -1 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError('Invalid ttl option must be greater than 0');
  });
});
