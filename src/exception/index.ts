import { BadRequestException } from './400';
import { UnauthorizedException } from './401';
import { ForbiddenException } from './403';
import { NotFoundException } from './404';
import { ClientErrorException } from './4xx';
import { InternalErrorException } from './500';
import { ServerErrorException } from './5xx';
import { BaseException } from './base';

export const exception = {
  client: {
    ClientErrorException,
    ServerErrorException,
  },
  server: {
    InternalErrorException,
  },
  BaseException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
};
