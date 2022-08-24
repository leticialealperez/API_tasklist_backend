import { DeleteResult } from 'typeorm';
import { UseCase } from '../../../../../core/domain/contract/usecase';
import { ITask } from '../../models/task';
import { TokenGenerator } from '../../../../../core/infra/adapters/jwt-adapter';
import { NotAuthorizedError } from '../../errors/token-error';
import { IDeleteTaskParams } from './models/delete-task-params';
import { ITaskRepository } from '../../models/task-repository';
import { ICacheRepository } from '../../../../../core/domain/model/cache-repository';

export class DeleteTaskUsecase implements UseCase {
  constructor(
    private repository: ITaskRepository,
    private cacheRepository: ICacheRepository
  ) {}

  async run(data: IDeleteTaskParams) {
    // pega o payload do token
    let { userId, userName } = TokenGenerator.verifyToken(data.token).payload;

    // deleta a tarefa pelo id dela
    let deletedTask: DeleteResult = await this.repository.delete(data.id);

    // apaga o cache
    await this.cacheRepository.flush();

    return {
      deleted: deletedTask.affected
    };
  }
}
