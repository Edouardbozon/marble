import { HttpRequest, HttpResponse } from '@marblejs/core';
import { fromEvent, Timestamp } from 'rxjs';
import { take, filter, mapTo } from 'rxjs/operators';
import { factorizeLog } from './logger.factory';
import { LoggerOptions } from './logger.model';
import { writeToStream, isNotSilent, filterResponse } from './logger.util';

export const loggerHandler = (res: HttpResponse, opts: LoggerOptions) => (stamp: Timestamp<HttpRequest>) =>
  fromEvent(res, 'finish')
    .pipe(
      take(1),
      mapTo(res),
      filter(isNotSilent(opts)),
      filter(filterResponse(opts)),
    )
    .subscribe(() => {
      const { info } = console;
      const log = factorizeLog(res, stamp);
      const streamLog = log({ colorize: false, timestamp: true });
      const consoleLog = log({ colorize: true });

      opts.stream
        ? writeToStream(opts.stream, streamLog)
        : info(consoleLog);
    });
