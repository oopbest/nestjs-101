import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js'; // 👈 1. import PrismaService

@Injectable()
export class TasksService {
  // 👈 2. Inject PrismaService ผ่าน Constructor
  constructor(private readonly prisma: PrismaService) {}

  // 1. Create: บันทึกลง SQLite
  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        userId: 1,
      },
    });
  }

  // 2. Find All: ดึงข้อมูลทั้งหมด เรียงจากใหม่ไปเก่า
  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Find One: ค้นหาตาม ID
  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  // 4. Update: อัปเดตข้อมูลตาม ID
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    // ตรวจสอบก่อนว่ามีข้อมูล ID นี้จริงไหม (ถ้าไม่มีจะ throw 404 จาก findOne)
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  // 5. Remove: ลบข้อมูลตาม ID
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
