import { UserTable } from './database.user.types';
import { TaskTable } from './database.task.types';

export interface Database {
  user: UserTable;
  task: TaskTable;
}

export type WorkerDatabase = Omit<Database, 'user'>;
