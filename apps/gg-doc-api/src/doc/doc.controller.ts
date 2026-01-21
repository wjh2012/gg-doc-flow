import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Inject,
  ParseIntPipe,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

interface TaskStatusEvent {
  data: any;
}

@ApiTags('Doc')
@Controller('doc')
export class DocController {
  private taskStatusSubject = new Subject<any>();

  constructor(@Inject('DOC_SERVICE') private readonly docClient: ClientProxy) {}

  @Post('task/ocr')
  @HttpCode(202)
  async createOcrTask() {
    return firstValueFrom(
      this.docClient.send({ cmd: 'create_ocr_task' }, { userId: 'anonymous' }),
    );
  }

  @Post('task/detection')
  @HttpCode(202)
  async createDetectionTask() {
    return firstValueFrom(
      this.docClient.send(
        { cmd: 'create_detection_task' },
        { userId: 'anonymous' },
      ),
    );
  }

  @Get('task/recent')
  async getRecentTasks(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    return firstValueFrom(
      this.docClient.send({ cmd: 'get_recent_tasks' }, { limit }),
    );
  }

  @Sse('task/sse')
  sse(): Observable<TaskStatusEvent> {
    return this.taskStatusSubject
      .asObservable()
      .pipe(map((task) => ({ data: task })));
  }

  handleTaskStatusUpdate(data: any) {
    this.taskStatusSubject.next(data);
  }
}
