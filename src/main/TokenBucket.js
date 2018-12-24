// @flow

// Exposes a time-based token bucket.
export default class TokenBucket {
  // How many new tokens are added to the bucket each second
  refillRate: number;
  // How many tokens does the bucket hold? Bucket starts full of tokens.
  capacity: number;
  clock: number;

  constructor(refillRate: number, capacity: number) {
    this.refillRate = refillRate;
    this.capacity = capacity;
    this.clock = 0;
  }

  // How many tokens away from max capacity are we?
  consumedTokens(): number {
    const now = this.now();
    const clock = Math.max(this.clock, now);
    return (clock - now) * this.refillRate;
  }

  // What is the recent average tokens per second taken?
  averageRate(): number {
    // if consumed tokens is capacity, return refillRate
    // if consumed tokens is 0, return 0
    return this.consumedTokens() / this.capacity * this.refillRate;
  }

  // Does the bucket hold at least n tokens?
  hasTokens(n: number): boolean {
    const now = this.now();
    const clock = Math.max(this.clock, now);
    return clock + n / this.refillRate <= now + this.capacity / this.refillRate;
  }

  // Take n tokens from the bucket
  takeTokens(n: number): void {
    const now = this.now();
    const clock = Math.max(this.clock, now) + n / this.refillRate;
    if (clock > now + this.capacity / this.refillRate) {
      throw new Error("insufficient tokens");
    }
    this.clock = clock;
  }

  // Return the number of seconds until n tokens will be available
  delayForTokens(n: number): number {
    if (n > this.capacity) {
      throw new Error("insufficient capacity");
    }
    const now = this.now();
    const clock = Math.max(this.clock, now);
    return clock + (n - this.capacity) / this.refillRate - now;
  }

  now() {
    return Date.now() / 1000;
  }
}
