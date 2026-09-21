import type { SdkLogger } from './logger';
import type { SdkHttpOptions } from '../_transport/http';

export interface SdkClientOptions extends SdkHttpOptions {
  logger?: SdkLogger;
}
