import { interval, Subscription } from 'rxjs';
import { tap, skip } from 'rxjs/operators';

export class MemoryStore {
  private tokens = new Map<string, number>();
  private threshold: number | undefined;
  private expirationSub: Subscription | undefined;

  check(key: string, consume = true): boolean {
    if (consume) {
      this.consume(key);
    }

    return this.tokens.get(key)! >= 0;
  }

  start(threshold: number, ttl: number): void {
    const expiration$ = interval(Math.floor(ttl)).pipe(
      skip(1),
      tap(() => this.tokens.clear())
    );
    this.threshold = Math.floor(threshold);
    this.expirationSub = expiration$.subscribe();
  }

  private consume(key: string): void {
    this.tokens.set(key, this.get(key));
  }

  private get(key: string): number {
    return (this.tokens.has(key) ? this.tokens.get(key)! : this.threshold!) - 1;
  }
}
