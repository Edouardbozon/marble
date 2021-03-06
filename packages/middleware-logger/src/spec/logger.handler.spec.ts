import { Timestamp } from 'rxjs';
import { EventEmitter } from 'events';
import { WriteStream } from 'fs';
import { HttpResponse, HttpRequest } from '@marblejs/core';
import { loggerHandler } from '../logger.handler';
import { LoggerOptions } from '../logger.model';

class HttpResponseMock extends EventEmitter {}

describe('#loggerHandler', () => {
  let loggerUtil;
  let loggerFactory;

  beforeEach(() => {
    jest.unmock('../logger.util.ts');
    loggerUtil = require('../logger.util.ts');

    jest.unmock('../logger.factory.ts');
    loggerFactory = require('../logger.factory.ts');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('writes log to provided stream', () => {
    // given
    const res = new HttpResponseMock() as HttpResponse;
    const stream = {} as WriteStream;
    const opts = { silent: false, stream } as LoggerOptions;
    const stamp = {} as Timestamp<HttpRequest>;
    const expectedLog = 'test_log';

    // when
    loggerUtil.writeToStream = jest.fn();
    loggerFactory.factorizeLog = jest.fn(() => () => expectedLog);
    loggerHandler(res, opts)(stamp);
    res.emit('finish');

    // then
    expect(loggerUtil.writeToStream).toHaveBeenCalledWith(stream, expectedLog);
  });

  test('writes log to console.info', () => {
    // given
    const res = new HttpResponseMock() as HttpResponse;
    const opts = { silent: false };
    const stamp = {} as Timestamp<HttpRequest>;
    const expectedLog = 'test_log';

    // when
    jest.spyOn(console, 'info').mockImplementation(jest.fn());
    loggerUtil.writeToStream = jest.fn();
    loggerFactory.factorizeLog = jest.fn(() => () => expectedLog);
    loggerHandler(res, opts)(stamp);
    res.emit('finish');

    // then
    expect(console.info).toHaveBeenCalledWith(expectedLog);
  });
});
