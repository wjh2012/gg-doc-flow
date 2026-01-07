import { Task, NewTask, TaskUpdate } from '@app/database';

export abstract class ITaskRepository {
  abstract findTaskById(id: string): Promise<Task | undefined>;
  abstract createTask(data: NewTask): Promise<Task>;
  abstract updateTask(id: string, data: TaskUpdate): Promise<void>;
  abstract deleteTask(id: string): Promise<Task | undefined>;
}
