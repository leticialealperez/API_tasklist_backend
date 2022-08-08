import { ICacheRepository } from './../../../../../core/domain/model/cache-repository';
import { TokenGenerator } from '../../../../../core/infra/adapters/jwt-adapter';
import { UseCase } from '../../../../../core/domain/contract/usecase';
import { ITask } from '../../models/task';
import { GenerateUid } from '../../../../../core/infra/adapters/uuidGenerator';
import { ICreateTaskParams } from './models/create-task-params';
import { ITaskRepository } from '../../models/task-repository';

export class CreateTaskUsecase implements UseCase {
  constructor(
    private repository: ITaskRepository,
    private cacheRepository: ICacheRepository
  ) {}

  async run(data: ICreateTaskParams) {
    // pega o payload do token
    let payload = TokenGenerator.verifyToken(data.token).payload;

    // cria a tarefa
    let newTask: ITask = {
      id: GenerateUid.newUUID(),
      description: data.task.description as string,
      detail: data.task.detail as string,
      user_id: payload.userId,
    };

    // salva a tarefa
    let savedTask = await this.repository.create(newTask);

    // apaga o cache
    await this.cacheRepository.flush();

    return savedTask;
  }
}
