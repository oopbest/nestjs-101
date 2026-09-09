import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getWelcomeMessage(name: string): string {
    return `Welcome, ${name}!`;
  }
}
