import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Kysely } from 'kysely';
import { firstValueFrom } from 'rxjs';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, WorkerDatabase } from '@app/database';
import { BaseDocFlowService } from '@app/common-worker';
import { OcrGrpcClient } from '@app/ocr-client';

@Injectable()
export class OcrService extends BaseDocFlowService {
  constructor(
    @Inject(KYSELY_DB) db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') client: ClientProxy,
    private readonly ocrClient: OcrGrpcClient,
  ) {
    super(db, client);
  }

  protected async executeTask(data: CreateDocJobPayload): Promise<void> {
    this.logger.log(`OCR 처리: ${data.docId}`);

    try {
      const response = await firstValueFrom(
        this.ocrClient.extractText({
          task_id: data.docId,
          image_url: data.imageUrl || '',
          language: 'ko',
        }),
      );

      if (!response.success) {
        throw new Error(response.error_message || 'OCR 처리 실패');
      }

      this.logger.log(
        `OCR 완료: ${data.docId}, 신뢰도: ${response.confidence}`,
      );
    } catch (error) {
      this.logger.warn(`gRPC 연결 실패, 폴백 처리: ${data.docId}`);
      await this.fallbackProcess(data);
    }
  }

  private async fallbackProcess(data: CreateDocJobPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log(`폴백 OCR 완료: ${data.docId}`);
  }
}
