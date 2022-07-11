import { UpdateResult, DeleteResult } from 'typeorm';
import { ITask } from './task';

export interface ITaskRepository {
  readAllOfId(uid: string): Promise<ITask[]>;
  create(newTask: ITask): Promise<ITask>;
  update(uid: string, task: Partial<ITask>): Promise<UpdateResult>;
  delete(uid: string): Promise<DeleteResult>;
}
