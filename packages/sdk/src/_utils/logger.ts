import type { SDK_CLIENT_NAMES } from '../_errors';

export interface SdkLogEvent {
  source: SDK_CLIENT_NAMES;
  action: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface SdkLogger {
  info: (event: SdkLogEvent) => void;
  debug: (event: SdkLogEvent) => void;
  error: (event: SdkLogEvent) => void;
}

export const sdkLoggerConsole: SdkLogger = {
  info: (event) => {
    const s = `[${event.source}:${event.action}]: ${event.message}`;
    if (event.data) {
      console.info(`${s}, ${JSON.stringify(event.data)}`);
    } else {
      console.info(s);
    }
  },
  debug: (event) => {
    const s = `[${event.source}:${event.action}]: ${event.message}`;
    if (event.data) {
      console.debug(`${s}, ${JSON.stringify(event.data)}`);
    } else {
      console.debug(s);
    }
  },
  error: (event) => {
    const s = `[${event.source}:${event.action}]: ${event.message}`;
    if (event.data) {
      console.error(`${s}, ${JSON.stringify(event.data)}`);
    } else {
      console.error(s);
    }
  },
};

export const sdkLoggerNoop: SdkLogger = {
  info: () => {},
  debug: () => {},
  error: () => {},
};
