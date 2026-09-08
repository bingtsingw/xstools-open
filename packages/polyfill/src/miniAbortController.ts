type AbortEvent = {
  readonly type: 'abort';
  readonly target: MiniAbortSignal;
  readonly currentTarget: MiniAbortSignal;
};

type AbortEventHandler = (this: MiniAbortSignal, event: AbortEvent) => void;
type AbortListener = AbortEventHandler | { handleEvent: (event: AbortEvent) => void };
type ListenerOptions = boolean | { once?: boolean } | undefined;

class MiniAbortSignal {
  private readonly listeners = new Map<AbortListener, { once: boolean }>();

  private abortedValue = false;
  private reasonValue: unknown;
  onabort: AbortEventHandler | null = null;

  get aborted() {
    return this.abortedValue;
  }

  get reason() {
    return this.reasonValue;
  }

  addEventListener(type: string, listener: AbortListener | null, options?: ListenerOptions) {
    if (type !== 'abort' || listener === null || this.listeners.has(listener)) {
      return;
    }

    this.listeners.set(listener, { once: typeof options === 'object' && options.once === true });
  }

  removeEventListener(type: string, listener: AbortListener | null) {
    if (type === 'abort' && listener !== null) {
      this.listeners.delete(listener);
    }
  }

  throwIfAborted(): void {
    if (this.abortedValue) {
      throw this.reasonValue;
    }
  }

  static abort(signal: MiniAbortSignal, reason: unknown): void {
    if (signal.abortedValue) {
      return;
    }

    signal.abortedValue = true;
    signal.reasonValue = reason;

    const event: AbortEvent = { currentTarget: signal, target: signal, type: 'abort' };
    if (signal.onabort !== null) {
      callListener(signal.onabort, signal, event);
    }

    const listeners = Array.from(signal.listeners);
    for (const [listener, options] of listeners) {
      if (signal.listeners.get(listener) !== options) {
        continue;
      }

      if (options.once) {
        signal.listeners.delete(listener);
      }

      callListener(listener, signal, event);
    }
  }
}

const callListener = (listener: AbortListener, signal: MiniAbortSignal, event: AbortEvent): void => {
  if (typeof listener === 'function') {
    listener.call(signal, event);
    return;
  }

  listener.handleEvent(event);
};

const createAbortReason = (): unknown => {
  if (typeof DOMException === 'function') {
    return new DOMException('This operation was aborted', 'AbortError');
  }

  const error = new Error('This operation was aborted');
  error.name = 'AbortError';
  return error;
};

class MiniAbortController {
  readonly signal = new MiniAbortSignal();

  abort(reason: unknown = createAbortReason()): void {
    MiniAbortSignal.abort(this.signal, reason);
  }
}

interface AbortControllerHost {
  AbortController?: unknown;
  AbortSignal?: unknown;
}

/**
 * Installs the minimal AbortController fallback only when both AbortController
 * and AbortSignal are unavailable, returning whether installation occurred.
 */
export const installAbortControllerPolyfill = (host: AbortControllerHost = globalThis): boolean => {
  if (typeof host.AbortController === 'function' || typeof host.AbortSignal === 'function') {
    return false;
  }

  host.AbortController = MiniAbortController;
  host.AbortSignal = MiniAbortSignal;
  return true;
};

installAbortControllerPolyfill();
