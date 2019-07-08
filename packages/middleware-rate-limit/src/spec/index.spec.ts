import * as index from '../index';

test('index exposes public API', () => {
  expect(index.rateLimit$).toBeDefined();
});
