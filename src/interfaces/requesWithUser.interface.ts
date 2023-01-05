import { Request } from 'express';
import { User } from './index';

export interface RequestWithUser extends Request {
  user: User;
}