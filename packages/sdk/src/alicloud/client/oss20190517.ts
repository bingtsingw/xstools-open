import { createHmac } from 'crypto';
import { nanoid } from '@xstools/utility/nanoid';
import { ALI_OSS, SdkExceptionInternalError } from '../../_errors';
import { getDataInfo } from '../../_utils/getDataInfo';
import type { SdkClientOptions } from '../../_utils/sdkClient';
import { encodeOssObjectKey, getOssObjectKey, getOssObjectUrl } from '../_utils/object';
import { RequestOss, type RequestOssOption } from '../request';
import type { Alicloud } from '../types';

export class AlicloudClientOss20190517 {
  public static readonly NAME = ALI_OSS;

  #config: Alicloud.Oss.ClientConfig;
  #request: RequestOss;

  public constructor(config: Alicloud.Oss.ClientConfig, options?: SdkClientOptions) {
    const { logger: _, ...httpOptions } = options ?? {};
    this.#config = {
      ...config,
      host: config.host.replace(/^(https|http):\/\//, ''),
      region: config.region.startsWith('oss-') ? config.region : `oss-${config.region}`,
    };
    this.#request = new RequestOss(AlicloudClientOss20190517.NAME, this.#config, httpOptions);
  }

  public async doRequest<T>(requestOption: RequestOssOption): Promise<T> {
    return this.#request.doRequest(requestOption);
  }

  /**
   * @param options
   * @param options.size : size in MB;
   * @param options.expire : expire in minutes
   * @param options.prefix : example: `article` or `admin/group`
   */
  public getUploadSignature({
    size,
    expire,
    prefix = '',
  }: {
    size: number;
    expire: number;
    prefix?: string;
  }): Alicloud.Oss.UploadSignature {
    const { accessKeyId, accessKeySecret, bucket } = this.#config;

    const expiration = new Date(new Date().getTime() + expire * 60 * 1000).toISOString();
    const key = prefix ? `${prefix}/${nanoid()}` : nanoid();
    const policy = Buffer.from(
      JSON.stringify({
        expiration,
        conditions: [{ bucket }, { key }, ['content-length-range', 0, 1024 * 1024 * size]],
      }),
    ).toString('base64');
    const signature = createHmac('sha1', accessKeySecret).update(policy).digest('base64');

    return { host: `https://${this.#config.host}`, ak: accessKeyId, key, policy, signature, id: key };
  }

  /**
   * @param options
   * @param options.input : Buffer | ArrayBufferLike | Readable;
   * @param options.prefix : example: `article` or `admin/group`
   * @param options.limitSize : size in MB;
   */
  public async objectPut({ input, prefix = '', limitSize = 1 }: Alicloud.Oss.PutObject): Promise<string> {
    let dataInfo: Awaited<ReturnType<typeof getDataInfo>>;

    try {
      dataInfo = await getDataInfo(input);
      if (dataInfo.size > limitSize * 1024 * 1024) {
        throw new RangeError('Exceeded limit file size');
      }
    } catch (cause) {
      throw new SdkExceptionInternalError(
        {
          source: AlicloudClientOss20190517.NAME,
          operation: 'objectPut',
          message: cause instanceof Error ? cause.message : 'Failed to read upload data',
        },
        { cause },
      );
    }

    const { size, data, mime } = dataInfo;

    const object = prefix ? `${prefix}/${nanoid()}` : nanoid();

    await this.#request.doRequest({
      operation: 'objectPut',
      method: 'PUT',
      body: data,
      object,
      headers: {
        'content-type': mime,
        'content-length': size.toString(),
      },
    });

    return getOssObjectUrl(this.#config.host, object);
  }

  public async objectCopy({ source, target, sourceBucket }: { source: string; target: string; sourceBucket?: string }) {
    const sourceKey = getOssObjectKey(source);
    const copySource = sourceBucket
      ? `/${sourceBucket}/${encodeOssObjectKey(sourceKey)}`
      : `/${this.#config.bucket}/${encodeOssObjectKey(sourceKey)}`;

    await this.#request.doRequest({
      operation: 'objectCopy',
      method: 'PUT',
      object: target,
      headers: {
        'x-oss-copy-source': copySource,
      },
    });
  }

  public async objectDelete(object: string) {
    await this.#request.doRequest({
      operation: 'objectDelete',
      method: 'DELETE',
      object,
    });
  }

  public async objectMove({ source, target }: { source: string; target: string }) {
    await this.objectCopy({ source, target });
    await this.objectDelete(source);
  }
}
