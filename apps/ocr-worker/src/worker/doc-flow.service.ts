import { Injectable } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/shared';

@Injectable()
export class DocFlowService {
  async createDocument(data: CreateDocJobPayload) {
  }
}
