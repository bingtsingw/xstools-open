export namespace Xcloud {
  export interface ClientConfig {
    ak: string;
    baseUrl: string;
  }

  export interface GeoIpToLocationInput {
    ip: string;
  }

  export interface CanvasDrawInput {
    templateKey: string;
    templateParam: Record<string, unknown>;
  }

  export interface CitySearchInput {
    name: string;
  }

  export interface CitySearchOutput {
    code: string;
    name: string;
    pinyin: string;
    tz: string;
  }

  export interface CaptchaPhoneSendInput {
    phone: string;
    scene: string;
    useSms: boolean;
  }

  export interface CaptchaPhoneValidateInput {
    phone: string;
    scene: string;
    value: string;
  }
}
