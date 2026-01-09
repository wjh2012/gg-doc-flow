import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  context,
  trace,
  SpanKind,
  SpanStatusCode,
  propagation,
} from '@opentelemetry/api';

const BULLMQ_TRACE_CONTEXT_KEY = '__otel_trace_context__';

export abstract class BaseWorkerHost<T = any> extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name);
  protected abstract readonly queueName: string;

  async process(job: Job<T, any, string>): Promise<any> {
    const tracer = trace.getTracer('bullmq-worker');
    const traceContext = (job.data as any)?.[BULLMQ_TRACE_CONTEXT_KEY];

    let parentContext = context.active();
    if (traceContext) {
      parentContext = propagation.extract(context.active(), traceContext);
    }

    const span = tracer.startSpan(
      `${this.queueName} process`,
      {
        kind: SpanKind.CONSUMER,
        attributes: {
          'messaging.system': 'bullmq',
          'messaging.destination': this.queueName,
          'messaging.destination.kind': 'queue',
          'messaging.operation': 'process',
          'bullmq.job.id': job.id,
          'bullmq.job.name': job.name,
          'bullmq.job.attempts': job.attemptsMade,
        },
      },
      parentContext,
    );

    return context.with(trace.setSpan(parentContext, span), async () => {
      try {
        const result = await this.handle(job.data);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error: any) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error?.message,
        });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  abstract handle(data: T): Promise<void>;

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    this.logger.error(`Job failed ${job.id}`, err);
  }

  @OnWorkerEvent('error')
  onError(err: any) {
    this.logger.error(`Job error`, err);
  }
}
