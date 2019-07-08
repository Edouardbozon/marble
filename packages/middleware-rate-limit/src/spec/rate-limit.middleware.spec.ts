import { rateLimit$ } from '../rate-limit.middleware';
import { httpListener, createContext, r, use } from '@marblejs/core';
import * as request from 'supertest';
import { map } from 'rxjs/operators';

const auth$ = r.pipe(
  r.matchPath('/auth'),
  r.matchType('POST'),
  r.useEffect(req$ =>
    req$.pipe(
      use(rateLimit$({ threshold: 0, window: 100 })),
      map(() => ({
        body: 'Hello test'
      }))
    )
  )
);

const app = httpListener({
  effects: [auth$]
}).run(createContext());

describe('rateLimit$', () => {
  it('should throw for invalid threshold option', () => {
    const opts = { threshold: -1, window: 200 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError(
      'Invalid threshold option must be greater than 0'
    );
  });

  it('should throw for invalid window option', () => {
    const opts = { threshold: 200, window: -1 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError(
      'Invalid window option must be greater than 0'
    );
  });

  it('should increment store', async () =>
    request(app)
      .post('/auth')
      .send({ test: 'test' })
      .expect(429));
});
