import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // เชื่อมต่อ Database ทันทีที่ Module เริ่มทำงาน
    await this.$connect();
  }
}
