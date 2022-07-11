import { IReadUserTasksParams } from './../../../../../src/features/tasklist/domain/usecases/read-user-tasks/models/read-user-tasks-params';
import { TaskRepository } from './../../../../../src/features/tasklist/infra/repository/task-repository';
import { CreateTaskInDB } from './../../../../helpers/task-creator';
import { ITask } from '../../../../../src/features/tasklist/domain/models/task';
import { createServer } from '../../../../../src/core/presentation/server';
import { RedisConnection } from '../../../../../src/core/infra/database/connections/redis';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';
import { IUser } from '../../../../../src/features/user/domain/models/user';
import { CreateUserInDB } from '../../../../helpers/user-creator';
import { TokenGenerator } from '../../../../../src/core/infra/adapters/jwt-adapter';
import { ILoginPayload } from '../../../../../src/features/user/domain/usecases/login/models/login-payload';

import request from 'supertest';
import { ReadUserTasksUsecase } from '../../../../../src/features/tasklist/domain/usecases/read-user-tasks/read-user-tasks-usecase';
import { CacheRepository } from '../../../../../src/core/infra/repositories/cache-repository';

describe('feature Task - teste de create-user-task-controller', () => {
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

  test('should fail to find tasks without token', async () => {
    let token = '';
    await request(app)
      .get('/task/readTasksByUserId')
      .query({ token })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Usuário sem token, necessário novo login.');
      });
  });
  test('should fail to find tasks with an invalid token', async () => {
    let token = 'invalid_token';
    token = JSON.stringify(token);
    await request(app)
      .get('/task/readTasksByUserId')
      .query({ token })
      .expect((res) => {
        expect(res.status).toEqual(401);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('NotAuthorizedError');
        expect(res.body.error).toEqual('Não autorizado.');
      });
  });

  test("should find an empty array of user's tasks", async () => {
    const user: IUser = await CreateUserInDB();

    // gera um payload e envia no token jwt
    let userName = user.name as string;
    let userId = user.id as string;
    let payload: ILoginPayload = {
      userId,
      userName,
    };
    let token = JSON.stringify(TokenGenerator.newToken(payload));

    await request(app)
      .get('/task/readTasksByUserId')
      .query({ token })
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.ok).toEqual(true);
        expect(res.body.data.length).toEqual(0);
      });
  });

  test("should find an array of user's tasks", async () => {
    const user: IUser = await CreateUserInDB();
    const task1: ITask = await CreateTaskInDB(user.id);
    const task2: ITask = await CreateTaskInDB(user.id);
    const task3: ITask = await CreateTaskInDB(user.id);

    // gera um payload e envia no token jwt
    let userName = user.name as string;
    let userId = user.id as string;
    let payload: ILoginPayload = {
      userId,
      userName,
    };
    let token = JSON.stringify(TokenGenerator.newToken(payload));

    let result0 = await new ReadUserTasksUsecase(new TaskRepository(), new CacheRepository()).run({
      token: JSON.parse(token),
    }); // para ativar o cache

    await request(app)
      .get('/task/readTasksByUserId')
      .query({ token })
      .expect((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.ok).toEqual(true);
        expect(res.body.data.length).toEqual(3);
        let returnedTask1: Partial<ITask> = res.body.data[0];
        let returnedTask2: Partial<ITask> = res.body.data[1];
        let returnedTask3: Partial<ITask> = res.body.data[2];
        expect(returnedTask1.id).toEqual(task1.id);
        expect(returnedTask2.description).toEqual(task2.description);
        expect(returnedTask3.detail).toEqual(task3.detail);
      });
  });
});
