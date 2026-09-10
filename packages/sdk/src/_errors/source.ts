export type SDK_CLIENT_NAMES =
  | 'ALI-DYSMS'
  | 'ALI-OSS'
  | 'DINGTALK'
  | 'WECHAT-MINIPROGRAM'
  | 'WECHAT-OPLATFORM'
  | 'WECHAT-PAY'
  | 'WECHAT-PAY-PARTNER'
  | 'WECHAT-SUPPLIER'
  | 'XCLOUD'
  | 'YZH';

export const ALI_DYSMS = 'ALI-DYSMS' as const satisfies SDK_CLIENT_NAMES;
export const ALI_OSS = 'ALI-OSS' as const satisfies SDK_CLIENT_NAMES;
export const DINGTALK = 'DINGTALK' as const satisfies SDK_CLIENT_NAMES;
export const WECHAT_MINIPROGRAM = 'WECHAT-MINIPROGRAM' as const satisfies SDK_CLIENT_NAMES;
export const WECHAT_OPLATFORM = 'WECHAT-OPLATFORM' as const satisfies SDK_CLIENT_NAMES;
export const WECHAT_PAY = 'WECHAT-PAY' as const satisfies SDK_CLIENT_NAMES;
export const WECHAT_PAY_PARTNER = 'WECHAT-PAY-PARTNER' as const satisfies SDK_CLIENT_NAMES;
export const WECHAT_SUPPLIER = 'WECHAT-SUPPLIER' as const satisfies SDK_CLIENT_NAMES;
export const XCLOUD = 'XCLOUD' as const satisfies SDK_CLIENT_NAMES;
export const YZH = 'YZH' as const satisfies SDK_CLIENT_NAMES;
