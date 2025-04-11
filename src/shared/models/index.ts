import { Request } from 'express';

import { UserEntity } from '../../users';

export interface AppRequest extends Request {
  user?: UserEntity;
}
