import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  isWrapped,
} from '@opentelemetry/instrumentation';
import {
  context,
  trace,
  SpanKind,
  SpanStatusCode,
  propagation,
  Span,
} from '@opentelemetry/api';

const BULLMQ_TRACE_CONTEXT_KEY = '__otel_trace_context__';

export class BullMQInstrumentation extends InstrumentationBase {
  constructor() {
    super('bullmq-instrumentation', '1.0.0', {});
  }

  protected init() {
    return [
      new InstrumentationNodeModuleDefinition(
        'bullmq',
        ['>=1.0.0'],
        (moduleExports) => {
          this._patchQueue(moduleExports);
          this._patchWorker(moduleExports);
          return moduleExports;
        },
        (moduleExports) => {
          this._unpatchQueue(moduleExports);
          this._unpatchWorker(moduleExports);
          return moduleExports;
        },
      ),
    ];
  }

  private _patchQueue(moduleExports: any) {
    const Queue = moduleExports.Queue;
    if (!Queue?.prototype) return;

    if (isWrapped(Queue.prototype.add)) {
      this._unwrap(Queue.prototype, 'add');
    }
    this._wrap(Queue.prototype, 'add', this._patchQueueAdd());

    if (isWrapped(Queue.prototype.addBulk)) {
      this._unwrap(Queue.prototype, 'addBulk');
    }
    this._wrap(Queue.prototype, 'addBulk', this._patchQueueAddBulk());
  }

  private _unpatchQueue(moduleExports: any) {
    const Queue = moduleExports.Queue;
    if (!Queue?.prototype) return;

    if (isWrapped(Queue.prototype.add)) {
      this._unwrap(Queue.prototype, 'add');
    }
    if (isWrapped(Queue.prototype.addBulk)) {
      this._unwrap(Queue.prototype, 'addBulk');
    }
  }

  private _patchQueueAdd() {
    const instrumentation = this;
    return function (original: Function) {
      return async function (
        this: any,
        name: string,
        data: any,
        opts?: any,
      ): Promise<any> {
        const tracer = instrumentation.tracer;
        const queueName = this.name;

        const span = tracer.startSpan(`${queueName} send`, {
          kind: SpanKind.PRODUCER,
          attributes: {
            'messaging.system': 'bullmq',
            'messaging.destination': queueName,
            'messaging.destination.kind': 'queue',
            'messaging.operation': 'send',
            'bullmq.job.name': name,
          },
        });

        const traceContext: Record<string, string> = {};
        propagation.inject(trace.setSpan(context.active(), span), traceContext);

        const enrichedData = {
          ...data,
          [BULLMQ_TRACE_CONTEXT_KEY]: traceContext,
        };

        try {
          const result = await original.call(this, name, enrichedData, opts);
          if (result?.id) {
            span.setAttribute('bullmq.job.id', result.id);
          }
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
      };
    };
  }

  private _patchQueueAddBulk() {
    const instrumentation = this;
    return function (original: Function) {
      return async function (this: any, jobs: any[]): Promise<any> {
        const tracer = instrumentation.tracer;
        const queueName = this.name;

        const span = tracer.startSpan(`${queueName} send bulk`, {
          kind: SpanKind.PRODUCER,
          attributes: {
            'messaging.system': 'bullmq',
            'messaging.destination': queueName,
            'messaging.destination.kind': 'queue',
            'messaging.operation': 'send',
            'bullmq.bulk.count': jobs.length,
          },
        });

        const traceContext: Record<string, string> = {};
        propagation.inject(trace.setSpan(context.active(), span), traceContext);

        const enrichedJobs = jobs.map((job) => ({
          ...job,
          data: {
            ...job.data,
            [BULLMQ_TRACE_CONTEXT_KEY]: traceContext,
          },
        }));

        try {
          const result = await original.call(this, enrichedJobs);
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
      };
    };
  }

  private _patchWorker(moduleExports: any) {
    const Worker = moduleExports.Worker;
    if (!Worker) return;

    const instrumentation = this;
    const originalWorker = Worker;

    moduleExports.Worker = function (
      name: string,
      processor: any,
      opts?: any,
    ): any {
      const wrappedProcessor =
        typeof processor === 'function'
          ? instrumentation._wrapProcessor(processor, name)
          : processor;

      return new originalWorker(name, wrappedProcessor, opts);
    };

    Object.setPrototypeOf(moduleExports.Worker, originalWorker);
    moduleExports.Worker.prototype = originalWorker.prototype;
  }

  private _unpatchWorker(moduleExports: any) {
    // Worker patching is done via constructor replacement, harder to unpatch
  }

  private _wrapProcessor(processor: Function, queueName: string) {
    const instrumentation = this;
    return async function (job: any, token?: string): Promise<any> {
      const tracer = instrumentation.tracer;
      const traceContext = job.data?.[BULLMQ_TRACE_CONTEXT_KEY];

      let parentContext = context.active();
      if (traceContext) {
        parentContext = propagation.extract(context.active(), traceContext);
      }

      const span = tracer.startSpan(
        `${queueName} process`,
        {
          kind: SpanKind.CONSUMER,
          attributes: {
            'messaging.system': 'bullmq',
            'messaging.destination': queueName,
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
          const result = await processor(job, token);
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
    };
  }
}

export function extractTraceContextFromJob(job: any): Span | undefined {
  const traceContext = job.data?.[BULLMQ_TRACE_CONTEXT_KEY];
  if (!traceContext) return undefined;

  const parentContext = propagation.extract(context.active(), traceContext);
  return trace.getSpan(parentContext);
}
