import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DatabaseConnection } from '../../../../core/infra/database/connections/connection';
import { Task } from './../../../../core/infra/database/entities/Task';
import { ITask } from '../../domain/models/task';
import { ITaskRepository } from '../../domain/models/task-repository';

export class TaskRepository implements ITaskRepository {
  private repository: Repository<ITask>;

  constructor() {
    this.repository = DatabaseConnection.getConnection().manager.getRepository(Task);
  }

  // retorna todas as tasks de um usuário pelo seu uid
  async readAllOfId(uid: string): Promise<ITask[]> {
    let idUserTaskList = await this.repository.find({ where: { user_id: { id: uid } } });
    return idUserTaskList;
  }

  // recebe e cria uma tarefa
  async create(newTask: ITask): Promise<ITask> {
    let newTaskEntity = this.repository.create(newTask);
    return this.repository.save(newTaskEntity);
  }

  // atualiza uma tarefa pelo seu uid
  async update(uid: string, task: Partial<ITask>): Promise<UpdateResult> {
    return await this.repository.update(uid, {
      description: task.description,
      detail: task.detail,
    });
  }

  // deleta uma tarefa pelo seu uid
  async delete(uid: string): Promise<DeleteResult> {
    return await this.repository.delete(uid);
  }
}
