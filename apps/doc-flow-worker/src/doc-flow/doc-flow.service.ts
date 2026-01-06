import { Injectable } from '@nestjs/common';
import { CreateDocJobPayload } from '../../../doc-flow-api/src/infra/message/doc-flow-queue.producer';

@Injectable()
export class DocFlowService {
  async createDocument(data: CreateDocJobPayload) {
  }
}
