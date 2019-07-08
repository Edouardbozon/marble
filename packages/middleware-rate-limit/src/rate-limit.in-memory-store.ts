import { interval } from 'rxjs';
import { tap, skip } from 'rxjs/operators';

export class Store {
  private tokens = new Map<string, number>();

  constructor(private threshold: number, ttl: number) {
    const ttlMilliseconds = ttl * 1000;

    interval(ttlMilliseconds)
      .pipe(
        skip(1),
        tap(() => this.tokens.clear())
      )
      .subscribe();
  }

  check(key: string, consume = true): boolean {
    if (consume) {
      this.consume(key);
    }

    return this.tokens.get(key)! > 0;
  }

  private consume(key: string): void {
    const remaining = this.tokens.has(key)
      ? this.tokens.get(key)! - 1
      : this.threshold - 1;

    this.tokens.set(key, remaining);
  }
}
