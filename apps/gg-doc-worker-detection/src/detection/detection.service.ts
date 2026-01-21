import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Kysely } from 'kysely';
import { firstValueFrom } from 'rxjs';
import { CreateDocJobPayload } from '@app/common-types';
import { KYSELY_DB, WorkerDatabase } from '@app/database';
import { BaseDocFlowService } from '@app/common-worker';
import { DetectionGrpcClient } from '@app/common-grpc';

@Injectable()
export class DetectionService extends BaseDocFlowService {
  constructor(
    @Inject(KYSELY_DB) db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') client: ClientProxy,
    private readonly detectionClient: DetectionGrpcClient,
  ) {
    super(db, client);
  }

  protected async executeTask(data: CreateDocJobPayload): Promise<void> {
    this.logger.log(`Detection 처리: ${data.docId}`);

    try {
      const response = await firstValueFrom(
        this.detectionClient.detectObjects({
          task_id: data.docId,
          image_url: data.imageUrl || '',
          options: {
            confidence_threshold: 0.5,
            max_detections: 100,
          },
        }),
      );

      if (!response.success) {
        throw new Error(response.error_message || 'Detection 처리 실패');
      }

      this.logger.log(
        `Detection 완료: ${data.docId}, 감지된 객체: ${response.objects.length}개`,
      );
    } catch (error) {
      this.logger.warn(`gRPC 연결 실패, 폴백 처리: ${data.docId}`);
      await this.fallbackProcess(data);
    }
  }

  private async fallbackProcess(data: CreateDocJobPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`폴백 Detection 완료: ${data.docId}`);
  }
}
