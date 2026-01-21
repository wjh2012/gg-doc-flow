import { DetectionService } from './detection.service';
import { CreateDocJobPayload, QUEUE_NAMES } from '@app/common-types';
import { BaseWorkerHost, WorkerProcessor } from '@app/common-worker';

@WorkerProcessor(QUEUE_NAMES.OBJECT_DETECTION)
export class DetectionWorker extends BaseWorkerHost<CreateDocJobPayload> {
  constructor(private readonly detectionService: DetectionService) {
    super();
  }

  async handle(data: CreateDocJobPayload) {
    await this.detectionService.processTask(data);
  }
}
