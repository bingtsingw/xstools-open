import type { SDK_CLIENT_NAMES } from '../_errors';

export interface SdkLogEvent {
  source: SDK_CLIENT_NAMES;
  operation: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Client 侧可观测性。只记成功 / 进度，失败走 `SdkException*`，由调用方上报。
 *
 * @example
 * const logger: SdkLogger = { info: () => {}, debug: () => {} };
 */
export interface SdkLogger {
  info: (event: SdkLogEvent) => void;
  debug: (event: SdkLogEvent) => void;
}

const formatEvent = (event: SdkLogEvent): string => {
  const s = `[${event.source}:${event.operation}]: ${event.message}`;
  return event.data ? `${s}, ${JSON.stringify(event.data)}` : s;
};

export const sdkLoggerConsole: SdkLogger = {
  info: (event) => {
    console.info(formatEvent(event));
  },
  debug: (event) => {
    console.debug(formatEvent(event));
  },
};

export const sdkLoggerNoop: SdkLogger = {
  info: () => {},
  debug: () => {},
};
