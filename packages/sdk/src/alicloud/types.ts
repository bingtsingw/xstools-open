import type { Readable } from 'stream';

export namespace Alicloud {
  export interface ClientConfig {
    accessKeyId: string;
    accessKeySecret: string;
  }

  export namespace Oss {
    export interface ClientConfig extends Alicloud.ClientConfig {
      region: string;
      host: string;
      bucket: string;
    }

    export interface UploadSignature {
      host: string;
      ak: string;
      key: string;
      policy: string;
      signature: string;
      id: string;
    }

    export interface PutObject {
      input: Buffer | ArrayBufferLike | Readable;
      prefix?: string;
      limitSize?: number;
    }
  }

  export namespace Dysms {
    export interface Send {
      PhoneNumbers: string;
      SignName: string;
      TemplateCode: string;
      TemplateParam: string;
    }
  }
}
