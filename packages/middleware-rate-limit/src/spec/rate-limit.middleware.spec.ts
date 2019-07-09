import { rateLimit$ } from '../rate-limit.middleware';
import { httpListener, createContext, r, use } from '@marblejs/core';
import * as request from 'supertest';
import { map } from 'rxjs/operators';

describe('rateLimit$', () => {
  it('should throw for invalid threshold option', () => {
    const opts = { threshold: -1, ttl: 200 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError(
      'Invalid threshold option must be greater than 0'
    );
  });

  it('should throw for invalid window option', () => {
    const opts = { threshold: 200, ttl: -1 };
    const middleware$ = rateLimit$(opts);

    expect(middleware$).toThrowError(
      'Invalid ttl option must be greater than 0'
    );
  });

  it('should decrement store', async () => {
    const test$ = r.pipe(
      r.matchPath('/test'),
      r.matchType('POST'),
      r.useEffect(req$ =>
        req$.pipe(
          use(rateLimit$({ threshold: 2, ttl: 10000 })),
          map(() => ({
            body: 'Hello test'
          }))
        )
      )
    );

    const app = httpListener({
      effects: [test$]
    }).run(createContext());

    await request(app)
      .post('/test')
      .expect(200);
    await request(app)
      .post('/test')
      .expect(200);
    await request(app)
      .post('/test')
      .expect(429);
  });
});
