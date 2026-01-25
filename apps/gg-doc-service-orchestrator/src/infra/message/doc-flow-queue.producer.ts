import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { CreateDocJobPayload, QUEUE_NAMES } from '@app/common-worker';

@Injectable()
export class DocFlowQueueProducer {
  constructor(
    @InjectQueue(QUEUE_NAMES.OCR)
    private readonly ocrQueue: Queue,
    @InjectQueue(QUEUE_NAMES.OBJECT_DETECTION)
    private readonly obdQueue: Queue,
  ) {}

  async createOcrTask(payload: CreateDocJobPayload) {
    try {
      await this.ocrQueue.add('ocr', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      });
      // console.log('Successfully added create_document job to queue');
    } catch (error) {
      // console.error('Failed to add create_document job to queue:', error);
      throw error;
    }
  }

  async createDetectionTask(payload: CreateDocJobPayload) {
    try {
      await this.obdQueue.add('detection', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
