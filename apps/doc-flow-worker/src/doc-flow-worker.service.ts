import { Injectable } from '@nestjs/common';

@Injectable()
export class DocFlowWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
