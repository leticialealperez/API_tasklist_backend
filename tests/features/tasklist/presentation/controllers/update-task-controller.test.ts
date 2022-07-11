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

  test('should fail to update a task without an id', async () => {
    await request(app)
      .put('/task/')
      .send({ description: 'any_description', detail: 'any_detail', id: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Id da tarefa não informado.');
      });
  });
  test('should fail to update a task without description and detail', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .put('/task/')
      .send({ description: '', detail: '', id: task.id })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira uma descrição e um detalhamento.');
      });
  });
  test('should fail to update a task without description', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .put('/task/')
      .send({ description: '', detail: 'updated_detail', id: task.id })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira uma descrição.');
      });
  });
  test('should fail to update a task without detail', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .put('/task/')
      .send({ description: 'updated_description', detail: '', id: task.id })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira um detalhamento.');
      });
  });
  test('should fail to update a task with a description greater than 50 characters ', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    let description: string = `One of Kafka's best-known works, Metamorphosis tells the story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect and subsequently struggles to adjust to this new condition.`;
    await request(app)
      .put('/task/')
      .send({ description, detail: 'updated_detail', id: task.id })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual(
          `A descrição não pode exceder 50 caracteres. Sua descrição possui ${
            Array.from(description).length
          } caracteres.`
        );
      });
  });
  test('should fail to update a task with a detail greater than 500 characters ', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    let detail: string = `One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought.`;
    await request(app)
      .put('/task/')
      .send({ description: 'updated_description', detail, id: task.id })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual(
          `O detalhamento não pode exceder 500 caracteres. Seu detalhamento possui ${
            Array.from(detail).length
          } caracteres.`
        );
      });
  });
  test('should fail to update a task without token', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .put('/task/')
      .send({
        description: 'updated_description',
        detail: 'updated_detail',
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
  test('should fail to update a task with an invalid token', async () => {
    let user: IUser = await CreateUserInDB();
    let task: ITask = await CreateTaskInDB(user.id);
    await request(app)
      .put('/task/')
      .send({
        description: 'updated_description',
        detail: 'updated_detail',
        token: 'invalid_token',
        id: task.id,
      })
      .expect((res) => {
        expect(res.status).toEqual(401);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('NotAuthorizedError');
        expect(res.body.error).toEqual('Não autorizado.');
      });
  });

  test('should update a task', async () => {
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

    await request(app)
      .put('/task/')
      .send({ description: 'updated_description', detail: 'updated_detail', token, id: task.id })
      .expect(async (res) => {
        expect(res.status).toEqual(200);
        expect(res.body.ok).toEqual(true);
        let taskArray: ITask[] = await new TaskRepository().readAllOfId(user.id);
        let data: ITask = taskArray[0];
        expect(data.description).toEqual('updated_description');
        expect(data.detail).toEqual('updated_detail');
      });
  });
});
