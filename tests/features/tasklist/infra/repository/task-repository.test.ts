import { ITaskRepository } from './../../../../../src/features/tasklist/domain/models/task-repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { GenerateUid } from './../../../../../src/core/infra/adapters/uuidGenerator';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';
import { RedisConnection } from '../../../../../src/core/infra/database/connections/redis';
import { createServer } from './../../../../../src/core/presentation/server';
import { CreateTaskInDB } from './../../../../helpers/task-creator';
import { CreateUserInDB } from './../../../../helpers/user-creator';
import { TaskRepository } from '../../../../../src/features/tasklist/infra/repository/task-repository';
import { IUser } from '../../../../../src/features/user/domain/models/user';
import { ITask } from '../../../../../src/features/tasklist/domain/models/task';

// library of string validators and sanitizers
import validator from 'validator';

// mocked repository
export class MockedTaskRepository implements ITaskRepository {
  async create(newTask: ITask): Promise<ITask> {
    throw new Error();
  }
  readAllOfId(uid: string): Promise<ITask[]> {
    throw new Error();
  }
  update(uid: string, task: Partial<ITask>): Promise<UpdateResult> {
    throw new Error();
  }
  delete(uid: string): Promise<DeleteResult> {
    throw new Error();
  }
}

// repository integration test
describe('feature Tasklist - teste de task-repository', () => {
  let app: Express.Application;
  beforeAll(async () => {
    await DatabaseConnection.initConnection();
    await RedisConnection.initConnection();
    app = createServer();
  });
  afterAll(async () => {
    await DatabaseConnection.closeConnection();
    await RedisConnection.closeConnection();
  });
  const makeSut = () => {
    const taskRepo = new TaskRepository();
    return taskRepo;
  };

  test('should create a task', async () => {
    const sut = makeSut();
    let user: IUser = await CreateUserInDB();
    const task: ITask = await CreateTaskInDB(user.id);
    const result: ITask = await sut.create(task);
    expect(result.user_id).toEqual(user.id);
    expect(result.detail).toEqual('any_detail');
    expect(result.description).toEqual('any_description');
    expect(validator.isUUID(result.id, 4)).toEqual(true);
    expect(validator.isDate(result.created_at as unknown as string)).toEqual(true);
    expect(validator.isDate(result.updated_at as unknown as string)).toEqual(true);
  });

  test('should find an array of tasks from an user by user.is', async () => {
    const sut = makeSut();
    let user: IUser = await CreateUserInDB();
    const task1: ITask = await CreateTaskInDB(user.id);
    const task2: ITask = await CreateTaskInDB(user.id);
    const task3: ITask = await CreateTaskInDB(user.id);
    const createdTask1: ITask = await sut.create(task1);
    const createdTask2: ITask = await sut.create(task2);
    const createdTask3: ITask = await sut.create(task3);
    const result: ITask[] = await sut.readAllOfId(user.id);
    expect(result.length).toEqual(3);
    expect(result[0].detail).toEqual('any_detail');
  });

  test('should find an empty array of tasks from an inexistent user by user.is', async () => {
    const sut = makeSut();
    const result: ITask[] = await sut.readAllOfId(GenerateUid.newUUID());
    expect(result.length).toEqual(0);
  });

  test('should update a task', async () => {
    const sut = makeSut();
    let user: IUser = await CreateUserInDB();
    const task: ITask = await CreateTaskInDB(user.id);
    const createdTask: ITask = await sut.create(task);
    const updateResult: UpdateResult = await sut.update(createdTask.id, {
      description: 'updated_description',
      detail: 'updated_detail',
    });
    const userTasks: ITask[] = await sut.readAllOfId(user.id);
    let updatedTask: ITask = userTasks[0];
    expect(updatedTask.description).toEqual('updated_description');
    expect(updatedTask.detail).toEqual('updated_detail');
  });

  test('should delete a task', async () => {
    const sut = makeSut();
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    let createdTask: ITask = await sut.create(task);
    const deleteResult: DeleteResult = await sut.delete(createdTask.id);
    const userTasks: ITask[] = await sut.readAllOfId(user.id);
    expect(userTasks.length).toEqual(0);
  });
});
