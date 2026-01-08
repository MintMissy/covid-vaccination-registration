import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ROLES_METADATA_KEY } from './constants/roles-metadata.const';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
