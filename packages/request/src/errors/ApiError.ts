import { createTaggedError } from '@xstools/utility/error';

export class ApiError extends createTaggedError<string>('__XSTOOLS_REQUEST__API_ERROR') {}
