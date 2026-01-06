import {
  Task,
  NewTask,
  TaskUpdate,
} from '../infra/database/types/database.task.types';

export abstract class ITaskRepository {
  abstract findTaskById(id: string): Promise<Task | undefined>;
  abstract createTask(data: NewTask): Promise<Task>;
  abstract updateTask(id: string, data: TaskUpdate): Promise<void>;
  abstract deleteTask(id: string): Promise<Task | undefined>;
}
