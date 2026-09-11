import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum.js';

export const ROLES_KEY = 'roles';

// Decorator นี้รับ Role ได้หลายตัว เช่น @Roles(Role.ADMIN) หรือ @Roles(Role.ADMIN, Role.USER)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
