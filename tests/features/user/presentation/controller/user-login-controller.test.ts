import { TokenGenerator } from './../../../../../src/core/infra/adapters/jwt-adapter';
import { CreateUserInDB } from './../../../../helpers/user-creator';
import { DuplicatedUserError } from '../../../../../src/features/user/domain/errors/duplicated-user';
import { GenerateUid } from '../../../../../src/core/infra/adapters/uuidGenerator';
import { createServer } from '../../../../../src/core/presentation/server';
import { RedisConnection } from '../../../../../src/core/infra/database/connections/redis';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';

import request from 'supertest';

// library of string validators and sanitizers
import validator from 'validator';
import { IUser } from '../../../../../src/features/user/domain/models/user';

// repository test
describe('feature User - teste de log-in-controller', () => {
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

  test('should fail to log in without name and pass', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: '', pass: '', Rpass: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Informe um nome e uma senha.');
      });
  });
  test('should fail to log in without name', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: '', pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Informe um nome.');
      });
  });
  test('should fail to log in without pass', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: 'any_name', pass: '', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Informe uma senha.');
      });
  });
  test('should fail to log in with short name', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: 'name', pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('O nome name não possui o mínimo de 5 caracteres.');
      });
  });
  test('should fail to log in with short pass', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: 'any_name', pass: 'pass', Rpass: 'pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('A senha informada não possui o mínimo de 5 caracteres.');
      });
  });
  test('should fail to log in with wrong pass', async () => {
    const user: IUser = await CreateUserInDB();
    await request(app)
      .post('/user/login')
      .send({ name: user.name, pass: 'wrong_pass', Rpass: 'wrong_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('DomainError');
        expect(res.body.error).toEqual('Senha incorreta.');
      });
  });
  test('should fail to log in with wrong name', async () => {
    await request(app)
      .post('/user/login')
      .send({ name: 'inexistent_name', pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(404);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('NotFoundError');
        expect(res.body.error).toEqual("Perfil de nome 'inexistent_name' não encontrado.");
      });
  });

  test('should log in', async () => {
    const user: IUser = await CreateUserInDB();
    await request(app)
      .post('/user/login')
      .send({ name: user.name, pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.body.ok).toEqual(true);
        expect(validator.isJWT(res.body.data)).toEqual(true);
        let payload = TokenGenerator.verifyToken(res.body.data).payload;
        expect(payload.userId).toEqual(user.id);
        expect(payload.userName).toEqual(user.name);
      });
  });
});
