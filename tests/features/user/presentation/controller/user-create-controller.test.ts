import { DuplicatedUserError } from './../../../../../src/features/user/domain/errors/duplicated-user';
import { GenerateUid } from './../../../../../src/core/infra/adapters/uuidGenerator';
import { createServer } from './../../../../../src/core/presentation/server';
import { RedisConnection } from './../../../../../src/core/infra/database/connections/redis';
import { DatabaseConnection } from '../../../../../src/core/infra/database/connections/connection';

import request from 'supertest';

describe('feature User - teste de user-create-controller', () => {
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
  test('should fail to create an user without name and pass', async () => {
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
  test('should fail to create an user without name', async () => {
    await request(app)
      .post('/user/')
      .send({ name: '', pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Informe um nome.');
      });
  });
  test('should fail to create an user without pass', async () => {
    await request(app)
      .post('/user/')
      .send({ name: 'any_name', pass: '', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Informe uma senha.');
      });
  });
  test('should fail to create an user without Rpass', async () => {
    await request(app)
      .post('/user/')
      .send({ name: 'any_name', pass: 'any_pass', Rpass: '' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Repita sua senha.');
      });
  });
  test('should fail to create an user with wrong Rpass', async () => {
    await request(app)
      .post('/user/')
      .send({ name: 'any_name', pass: 'any_pass', Rpass: 'wrong_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual('Repita corretamente sua senha.');
      });
  });
  test('should fail to create an user with short name', async () => {
    await request(app)
      .post('/user/')
      .send({ name: 'name', pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual(
          'O nome name não possui o mínimo de 5 caracteres.'
        );
      });
  });
  test('should fail to create an user with short pass', async () => {
    await request(app)
      .post('/user/')
      .send({ name: 'any_name', pass: 'pass', Rpass: 'pass' })
      .expect((res) => {
        expect(res.status).toEqual(403);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('ControllerError');
        expect(res.body.error).toEqual(
          'A senha informada não possui o mínimo de 5 caracteres.'
        );
      });
  });
  test('should fail to create an user with duplicated error', async () => {
    let fakeName: string = GenerateUid.newUUID();
    await request(app)
      .post('/user/')
      .send({ name: fakeName, pass: 'any_pass', Rpass: 'any_pass' });
    await request(app)
      .post('/user/')
      .send({ name: fakeName, pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        let erro = new DuplicatedUserError(fakeName);
        expect(res.body.error).toEqual(erro.message);
        expect(res.body.ok).toEqual(false);
        expect(res.body.identifier).toEqual('DuplicatedUserError');
      });
  });

  test('should return the user when creating a new user', async () => {
    let fakeName: string = GenerateUid.newUUID();
    await request(app)
      .post('/user/')
      .send({ name: fakeName, pass: 'any_pass', Rpass: 'any_pass' })
      .expect((res) => {
        expect(res.status).toEqual(201);
        expect(res.body.ok).toEqual(true);
      });
  });
});
