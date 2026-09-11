import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // ถ้าส่ง @CurrentUser('id') จะดึงเฉพาะ user.id ถ้าไม่ส่งจะดึงทั้งก้อน user
    return data ? user?.[data] : user;
  },
);
