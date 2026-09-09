import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task, TaskStatus } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  create(createTaskDto: CreateTaskDto): Task {
    const { title, description, status } = createTaskDto;

    const task: Task = {
      id: this.nextId++,
      title,
      description: description ?? '', // if undefined or null, set to empty string
      status: status ?? TaskStatus.PENDING, // if undefined or null, set to pending
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    Object.assign(task, updateTaskDto);
    task.updatedAt = new Date();
    return task;
  }

  remove(id: number) {
    const task = this.findOne(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    return task;
  }
}
