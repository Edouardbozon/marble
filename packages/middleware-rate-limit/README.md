<p align="center">
  <a href="https://marblejs.com">
    <img src="https://github.com/marblejs/marble/blob/master/assets/img/logo.png?raw=true" width="200" alt="Marble.js logo"/>
  </a>
</p>

# @marblejs/middleware-rate-limit

A rate limit middleware for [Marble.js](https://github.com/marblejs/marble).

## Installation

```
$ npm i @marblejs/middleware-rate-limit
```
Requires `@marblejs/core` to be installed.

## Documentation

For the latest updates, documentation, change log, and release information visit [docs.marblejs.com](https://docs.marblejs.com) and follow [@marble_js](https://twitter.com/marble_js) on Twitter.

## Usage

```typescript
import { rateLimit$ } from '@marblejs/middleware-rate-limit';

const middlewares = [
  rateLimit$(),
  ...
];

const effects = [
  ...
];

export const app = httpListener({ middlewares, effects });
```
License: MIT
