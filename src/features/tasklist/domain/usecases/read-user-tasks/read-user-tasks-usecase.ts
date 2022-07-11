import { UseCase } from '../../../../../core/domain/contract/usecase';
import { TokenGenerator } from '../../../../../core/infra/adapters/jwt-adapter';
import { NotAuthorizedError } from '../../errors/token-error';
import { ITask } from '../../models/task';
import { IReadUserTasksParams } from './models/read-user-tasks-params';
import { ICacheRepository } from '../../../../../core/domain/model/cache-repository';
import { ITaskRepository } from '../../models/task-repository';

export class ReadUserTasksUsecase implements UseCase {
  constructor(private repository: ITaskRepository, private cache_repository: ICacheRepository) {}

  async run(data: IReadUserTasksParams) {
    // pega o userId no payload do token
    let { userId } = TokenGenerator.verifyToken(data.token).payload;

    // verifica se possui cache primeiro
    let cachedTaskList: ITask[] | undefined = await this.cache_repository.get(`user:${userId}`);

    // se não houver cache, procura no bd e salva no cache
    let taskList: ITask[] = [];
    if (cachedTaskList == undefined || cachedTaskList.length <= 0) {
      // procura no bd
      taskList = await this.repository.readAllOfId(userId);
      // salva no cache
      await this.cache_repository.set(`user:${userId}`, taskList);
    } else {
      //  se houver cache, usa ele
      taskList = cachedTaskList;
    }

    return taskList;
  }
}
