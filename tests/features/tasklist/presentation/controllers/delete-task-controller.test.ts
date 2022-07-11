import { TaskRepository } from '../../../../../src/features/tasklist/infra/repository/task-repository';
import { CreateTaskInDB } from '../../../../helpers/task-creator';
import { ITask } from '../../../../../src/features/tasklist/domain/models/task';
import { createServer } from '../../../../../src/core/presentation/server';
import { RedisConnection } from '../../../../../src/core/infra/database/connections/redis';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';
import { IUser } from '../../../../../src/features/user/domain/models/user';
import { CreateUserInDB } from '../../../../helpers/user-creator';
import { TokenGenerator } from '../../../../../src/core/infra/adapters/jwt-adapter';
import { ILoginPayload } from '../../../../../src/features/user/domain/usecases/login/models/login-payload';

import request from 'supertest';

describe('feature Task - teste de update-task-controller', () => {
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

  test('should fail to delete a task without id', async () => {
    let token = 'invalid_token';
    token = JSON.stringify(token);

    await request(app)
      .delete('/task/')
      .query({ id: '', token })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Id da tarefa não informado.');
      });
  });
  test('should fail to delete a task without token', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .delete('/task/')
      .query({
        token: '',
        id: task.id,
      })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Usuário sem token, necessário novo login.');
      });
  });
  test('should fail to delete a task with an invalid token', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);

    let token = 'invalid_token';
    token = JSON.stringify(token);

    await request(app)
      .delete('/task/')
      .query({
        token,
        id: task.id,
      })
      .expect((res) => {
        expect(res.status).toEqual(401);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('NotAuthorizedError');
        expect(res.body.error).toEqual('Não autorizado.');
      });
  });

  test('should delete a task', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);

    // gera um payload e envia no token jwt
    let userName = user.name as string;
    let userId = user.id as string;
    let payload: ILoginPayload = {
      userId,
      userName,
    };
    let token = TokenGenerator.newToken(payload);
    token = JSON.stringify(token);

    await request(app)
      .delete('/task/')
      .query({ token, id: task.id })
      .expect(async (res) => {
        expect(res.status).toEqual(200);
        expect(res.body.ok).toEqual(true);
        let taskArray: ITask[] = await new TaskRepository().readAllOfId(user.id);
        expect(taskArray.length).toEqual(0);
      });
  });
});
