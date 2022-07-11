import { TaskRepository } from './../../src/features/tasklist/infra/repository/task-repository';
import { GenerateUid } from '../../src/core/infra/adapters/uuidGenerator';
import { ITask } from '../../src/features/tasklist/domain/models/task';

export const CreateTaskInDB: (userId: string) => Promise<ITask> = async (userId: string) => {
  return await new TaskRepository().create({
    id: GenerateUid.newUUID(),
    description: 'any_description',
    detail: 'any_detail',
    user_id: userId,
  });
};
