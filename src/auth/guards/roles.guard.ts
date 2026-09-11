import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector เป็นตัวช่วยของ NestJS ในการอ่าน Metadata จาก Decorator
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. อ่าน Role ที่กำหนดไว้ใน @Roles() ของ Endpoint นั้นๆ
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // ตรวจสอบระดับ Method
      context.getClass(), // ตรวจสอบระดับ Controller
    ]);

    // ถ้าไม่ได้แปะ @Roles ไว้ แสดงว่าเป็น Endpoint ทั่วไป ให้ผ่านได้เลย
    if (!requiredRoles) {
      return true;
    }

    // 2. ดึงข้อมูล user จาก Request (ซึ่งถูกแปะมาโดย JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. ตรวจสอบว่า Role ของ user ตรงกับที่กำหนดไว้หรือไม่
    const hasRole = requiredRoles.some((role) => user?.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
