import { BadRequestException } from './400';
import { UnauthorizedException } from './401';
import { ForbiddenException } from './403';
import { NotFoundException } from './404';
import { ClientException } from './4xx';
import { ServerException } from './5xx';

export const exception = {
  ClientException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ServerException,
};
