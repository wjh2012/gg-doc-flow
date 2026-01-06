import { Injectable } from '@nestjs/common';

@Injectable()
export class DocFlowWorkerService {
  processData(data: any): void {
    console.log(`메시지 처리 완료: ${data.message}`);
  }
}
