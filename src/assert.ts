export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

function format(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export class AssertionChain<T> {
  constructor(private value: T) {}

  // --- NULL / UNDEFINED (NARROWING) ---

  isNull(message?: string): AssertionChain<Extract<T, null>> {
    if (this.value !== null) {
      throw new AssertionError(message ?? `expected null but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as Extract<T, null>);
  }

  isNotNull(message?: string): AssertionChain<Exclude<T, null>> {
    if (this.value === null) {
      throw new AssertionError(message ?? `expected value not to be null`);
    }
    return new AssertionChain(this.value as Exclude<T, null>);
  }

  isUndefined(message?: string): AssertionChain<Extract<T, undefined>> {
    if (this.value !== undefined) {
      throw new AssertionError(message ?? `expected undefined but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as Extract<T, undefined>);
  }

  isNotUndefined(message?: string): AssertionChain<Exclude<T, undefined>> {
    if (this.value === undefined) {
      throw new AssertionError(message ?? `expected value not to be undefined`);
    }
    return new AssertionChain(this.value as Exclude<T, undefined>);
  }

  isDefined(message?: string): AssertionChain<NonNullable<T>> {
    if (this.value === null || this.value === undefined) {
      throw new AssertionError(message ?? `expected defined but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as NonNullable<T>);
  }

  // --- TRUTHINESS (NARROWING-ish) ---

  isTruthy(message?: string): AssertionChain<Exclude<T, false | 0 | "" | null | undefined>> {
    if (!this.value) {
      throw new AssertionError(message ?? `expected truthy but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as any);
  }

  isFalsy(message?: string): AssertionChain<Extract<T, false | 0 | "" | null | undefined>> {
    if (this.value) {
      throw new AssertionError(message ?? `expected falsy but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as any);
  }

  // --- TYPE CHECKS (NARROWING) ---

  isType<K extends "string" | "number" | "boolean" | "function" | "object" | "undefined">(
    expected: K,
    message?: string
  ): AssertionChain<
    K extends "string" ? string :
    K extends "number" ? number :
    K extends "boolean" ? boolean :
    K extends "function" ? Function :
    K extends "object" ? object :
    K extends "undefined" ? undefined :
    never
  > {
    const actual = typeof this.value;
    if (actual !== expected) {
      throw new AssertionError(message ?? `expected ${expected} but got ${actual}`);
    }
    return new AssertionChain(this.value as any);
  }

  isArray(message?: string): AssertionChain<Extract<T, any[]>> {
    if (!Array.isArray(this.value)) {
      throw new AssertionError(message ?? `expected array but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as Extract<T, any[]>);
  }

  isFunction(message?: string): AssertionChain<Extract<T, Function>> {
    if (typeof this.value !== "function") {
      throw new AssertionError(message ?? `expected function but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as Extract<T, Function>);
  }

  isObject(message?: string): AssertionChain<Extract<T, object>> {
    if (typeof this.value !== "object" || this.value === null) {
      throw new AssertionError(message ?? `expected object but got ${format(this.value)}!`);
    }
    return new AssertionChain(this.value as Extract<T, object>);
  }

  // --- NUMBER OPS (TYPE CONSTRAINED) ---

  isGreaterThan(this: AssertionChain<number>, other: number, message?: string): AssertionChain<number> {
    if (this.value <= other) {
      throw new AssertionError(message ?? `expected ${this.value} > ${other}`);
    }
    return this;
  }

  isLessThan(this: AssertionChain<number>, other: number, message?: string): AssertionChain<number> {
    if (this.value >= other) {
      throw new AssertionError(message ?? `expected ${this.value} < ${other}`);
    }
    return this;
  }

  // --- GENERIC PREDICATE (NO NARROWING) ---

  satisfies(predicate: (value: T) => boolean, message?: string): this {
    if (!predicate(this.value)) {
      throw new AssertionError(message ?? `predicate failed on ${format(this.value)}!`);
    }
    return this;
  }

  // --- UTILS ---

  map<U>(fn: (value: T) => U): AssertionChain<U> {
    return new AssertionChain(fn(this.value));
  }

  tap(fn: (value: T) => void): this {
    fn(this.value);
    return this;
  }

  unwrap(): T {
    return this.value;
  }
}

export const Assert = {
  that<T>(value: T) {
    return new AssertionChain(value);
  }
};
