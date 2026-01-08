import { Injectable, Inject } from '@nestjs/common';
import { CreateDocJobPayload } from '@app/common-types';
import { BaseWorkerService } from '@app/common-worker';
import { KYSELY_DB, WorkerDatabase } from '@app/database';
import { Kysely } from 'kysely';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocFlowService extends BaseWorkerService {
  constructor(
    @Inject(KYSELY_DB) protected readonly db: Kysely<WorkerDatabase>,
    @Inject('TASK_SERVICE') protected readonly client: ClientProxy,
  ) {
    super(db, client);
  }

  async processTask(data: CreateDocJobPayload) {
    console.log('Processing document...', data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.updateJobStatus(data.docId, 'SUCCESS');
  }
}
