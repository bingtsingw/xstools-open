import type { Env, MiddlewareHandler, ValidationTargets } from 'hono';
import type { ZodSchema, input, output } from 'zod';
import { validate } from './validate';

declare const apiInputMetadata: unique symbol;

type ApiInputOutput<TModule extends string, TExportName extends string, TValue> = TValue & {
  /** 仅在类型层存在；Hono 合并 AppType 时会保留字符串属性。 */
  readonly __apiInputMetadata?: `${TModule}#${TExportName}`;
};

type RegisteredApiInput<TSchema extends ZodSchema, TModule extends string, TExportName extends string> = TSchema & {
  readonly [apiInputMetadata]?: {
    readonly module: TModule;
    readonly exportName: TExportName;
  };
};

type RegisteredApiInputRegistry<TModule extends string, TExports extends object> = {
  readonly [
    TExportName in keyof TExports as TExportName extends string
      ? TExports[TExportName] extends ZodSchema
        ? TExportName
        : never
      : never
  ]: TExportName extends string
    ? TExports[TExportName] extends ZodSchema
      ? RegisteredApiInput<TExports[TExportName], TModule, TExportName>
      : never
    : never;
};

/**
 * 将 Zod schema 注册为 API 输入类型。
 *
 * 注册表是纯类型元数据：运行时仍直接使用原始 Zod schema；生成器据此还原命名类型。
 */
export const defineApiInputRegistry = <const TModule extends string, const TExports extends object>(
  _module: TModule,
  exports: TExports,
): RegisteredApiInputRegistry<TModule, TExports> => {
  return exports as RegisteredApiInputRegistry<TModule, TExports>;
};

type SchemaInput<TSchema extends ZodSchema> =
  TSchema extends RegisteredApiInput<infer TOriginalSchema, infer TModule, infer TExportName>
    ? ApiInputOutput<TModule, TExportName, output<TOriginalSchema>>
    : input<TSchema>;

type ValidationInputProperty<
  TValue,
  TTarget extends keyof ValidationTargets,
  TProperty extends keyof TValue,
> = TProperty extends '__apiInputMetadata' ? TValue[TProperty] : ValidationTargets[TTarget][TProperty];

type ValidateInput<TSchema extends ZodSchema, TTarget extends keyof ValidationTargets> = (
  undefined extends SchemaInput<TSchema> ? true : false
) extends true
  ? {
      [TKey in TTarget]?:
        | (SchemaInput<TSchema> extends infer TValue
            ? TValue extends SchemaInput<TSchema>
              ? TValue extends ValidationTargets[TKey]
                ? TValue
                : { [TProperty in keyof TValue]?: ValidationInputProperty<TValue, TKey, TProperty> | undefined }
              : never
            : never)
        | undefined;
    }
  : {
      [TKey in TTarget]: SchemaInput<TSchema> extends infer TValue
        ? TValue extends SchemaInput<TSchema>
          ? TValue extends ValidationTargets[TKey]
            ? TValue
            : { [TProperty in keyof TValue]: ValidationInputProperty<TValue, TKey, TProperty> }
          : never
        : never;
    };

type ValidateOutput<TSchema extends ZodSchema, TTarget extends keyof ValidationTargets> = {
  [TKey in TTarget]: output<TSchema>;
};

/**
 * 与 validate 调用方式一致，并为已注册输入保留生成所需的类型引用。
 */
export const apiValidate = <TSchema extends ZodSchema, TTarget extends keyof ValidationTargets>(
  target: TTarget,
  schema: TSchema,
): MiddlewareHandler<Env, string, { in: ValidateInput<TSchema, TTarget>; out: ValidateOutput<TSchema, TTarget> }> => {
  return validate(target, schema) as MiddlewareHandler<
    Env,
    string,
    { in: ValidateInput<TSchema, TTarget>; out: ValidateOutput<TSchema, TTarget> }
  >;
};
