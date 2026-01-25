import { OcrService } from './ocr.service';
import {
  BaseWorkerHost,
  CreateDocJobPayload,
  QUEUE_NAMES,
  WorkerProcessor,
} from '@app/common-worker';

@WorkerProcessor(QUEUE_NAMES.OCR)
export class OcrWorker extends BaseWorkerHost<CreateDocJobPayload> {
  constructor(private readonly ocrService: OcrService) {
    super();
  }

  async handle(data: CreateDocJobPayload) {
    await this.ocrService.processTask(data);
  }
}
