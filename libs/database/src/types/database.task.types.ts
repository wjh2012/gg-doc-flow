import {
  ColumnType,
  JSONColumnType,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';

export type TaskType = 'OCR' | 'ANALYZE' | 'DETECTION';
export type TaskStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface TaskTable {
  id: string;

  task_type: TaskType;
  status: TaskStatus;

  payload: JSONColumnType<Record<string, unknown>> | null;
  result: JSONColumnType<Record<string, unknown>> | null;

  created_at: ColumnType<Date, string | undefined, never>;
  started_at: ColumnType<Date | null, string | undefined, string | undefined>;
  finished_at: ColumnType<Date | null, string | undefined, string | undefined>;

  error_message: string | null;
}

export type Task = Selectable<TaskTable>;
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;
