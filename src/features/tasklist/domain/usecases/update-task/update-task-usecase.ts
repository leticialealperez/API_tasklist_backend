import { ICacheRepository } from './../../../../../core/domain/model/cache-repository';
import { UseCase } from '../../../../../core/domain/contract/usecase';
import { ITask } from '../../models/task';
import { TokenGenerator } from '../../../../../core/infra/adapters/jwt-adapter';
import { IUpdateTaskParams } from './models/update-task-params';
import { ITaskRepository } from '../../models/task-repository';

export class UpdateTaskUsecase implements UseCase {
  constructor(
    private repository: ITaskRepository,
    private cacheRepository: ICacheRepository
  ) {}

  async run(data: IUpdateTaskParams) {
    // pega o payload do token
    let { userId, userName } = TokenGenerator.verifyToken(data.token).payload;

    // cria a tarefa
    let newTask: ITask = {
      id: data.task.id as string,
      description: data.task.description as string,
      detail: data.task.detail as string,
      user_id: userId,
    };

    // atualiza a tarefa
    let updatedTask = await this.repository.update(
      data.task.id as string,
      newTask
    );

    // apaga o cache
    await this.cacheRepository.flush();

    return updatedTask;
  }
}
