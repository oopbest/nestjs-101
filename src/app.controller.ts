import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('welcome/:name')
  getWelcomeMessage(@Param('name') name: string): string {
    return this.appService.getWelcomeMessage(name);
  }
}
