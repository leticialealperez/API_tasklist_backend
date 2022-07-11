import { ITask } from './../../../../../src/features/tasklist/domain/models/task';
import { createServer } from './../../../../../src/core/presentation/server';
import { RedisConnection } from './../../../../../src/core/infra/database/connections/redis';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';
import { IUser } from '../../../../../src/features/user/domain/models/user';
import { CreateUserInDB } from '../../../../helpers/user-creator';
import { TokenGenerator } from '../../../../../src/core/infra/adapters/jwt-adapter';
import { ILoginPayload } from '../../../../../src/features/user/domain/usecases/login/models/login-payload';

import request from 'supertest';

describe('feature Task - teste de create-task-controller', () => {
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

  test('should fail to create a task without description and detail', async () => {
    await request(app)
      .post('/task/')
      .send({ description: '', detail: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira uma descrição e um detalhamento.');
      });
  });
  test('should fail to create a task without description', async () => {
    await request(app)
      .post('/task/')
      .send({ description: '', detail: 'any_detail' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira uma descrição.');
      });
  });
  test('should fail to create a task without detail', async () => {
    await request(app)
      .post('/task/')
      .send({ description: 'any_description', detail: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Insira um detalhamento.');
      });
  });
  test('should fail to create a task with a description greater than 50 characters ', async () => {
    let description: string = `One of Kafka's best-known works, Metamorphosis tells the story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect and subsequently struggles to adjust to this new condition.`;
    await request(app)
      .post('/task/')
      .send({ description, detail: 'any_detail' })
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
  test('should fail to create a task with a detail greater than 500 characters ', async () => {
    let detail: string = `One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought.`;
    await request(app)
      .post('/task/')
      .send({ description: 'any_description', detail })
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
  test('should fail to create a task without token', async () => {
    await request(app)
      .post('/task/')
      .send({ description: 'any_description', detail: 'any_detail', token: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Usuário sem token, necessário novo login.');
      });
  });
  test('should fail to create a task with an invalid token', async () => {
    await request(app)
      .post('/task/')
      .send({ description: 'any_description', detail: 'any_detail', token: 'invalid_token' })
      .expect((res) => {
        expect(res.status).toEqual(401);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('NotAuthorizedError');
        expect(res.body.error).toEqual('Não autorizado.');
      });
  });

  test('should create a task and return it', async () => {
    const user: IUser = await CreateUserInDB();

    // gera um payload e envia no token jwt
    let userName = user.name as string;
    let userId = user.id as string;
    let payload: ILoginPayload = {
      userId,
      userName,
    };
    let token = TokenGenerator.newToken(payload);

    await request(app)
      .post('/task/')
      .send({ description: 'any_description', detail: 'any_detail', token })
      .expect(async (res) => {
        expect(res.status).toEqual(201);
        expect(res.body.ok).toEqual(true);
        let data: ITask = res.body.data;
        expect(data.user_id).toEqual(user.id);
        expect(data.description).toEqual('any_description');
        expect(data.detail).toEqual('any_detail');
      });
  });
});
