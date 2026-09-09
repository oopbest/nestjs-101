import {
  IsEnum,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Learn NestJS' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title!: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Learn NestJS and build a RESTful API',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(100, {
    message: 'Description must be at most 100 characters long',
  })
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be pending, in_progress, or completed',
  })
  status?: TaskStatus;
}
