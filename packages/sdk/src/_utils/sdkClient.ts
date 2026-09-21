import type { SdkHttpOptions } from '../_transport/http';
import type { SdkLogger } from './logger';

export interface SdkClientOptions extends SdkHttpOptions {
  logger?: SdkLogger;
}
