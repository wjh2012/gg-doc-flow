import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

import { CreateDocJobPayload } from '@app/shared';

@Injectable()
export class DocFlowQueueProducer {
  constructor(
    @InjectQueue('ocr-queue')
    private readonly ocrQueue: Queue,
    @InjectQueue('obd-queue')
    private readonly obdQueue: Queue,
  ) {}

  async createOcrTask(payload: CreateDocJobPayload) {
    console.log('Adding create_document job to queue:', payload);
    try {
      await this.ocrQueue.add('ocr', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      });
      console.log('Successfully added create_document job to queue');
    } catch (error) {
      console.error('Failed to add create_document job to queue:', error);
      throw error;
    }
  }

  async createDetectionTask(payload: CreateDocJobPayload) {
    console.log('Adding create_detection job to queue:', payload);
    try {
      await this.obdQueue.add('detection', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      });
      console.log('Successfully added create_detection job to queue');
    } catch (error) {
      console.error('Failed to add create_detection job to queue:', error);
      throw error;
    }
  }
}
