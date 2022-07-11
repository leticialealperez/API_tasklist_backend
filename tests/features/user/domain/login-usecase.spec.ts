import { IUser } from './../../../../src/features/user/domain/models/user';
import { TokenGenerator } from './../../../../src/core/infra/adapters/jwt-adapter';
import { DomainError } from './../../../../src/core/domain/errors/domain-error';
import { CreateAccountUsecase } from './../../../../src/features/user/domain/usecases/create-account/create-account-usecase';
import { GenerateUid } from './../../../../src/core/infra/adapters/uuidGenerator';
import { CreateUser } from './../../../helpers/user-creator';
import { LoginUseCase } from './../../../../src/features/user/domain/usecases/login/login-usecase';
import { MockUserRepository } from '../infra/repository/user-repository.test';
import { NotFoundError } from '../../../../src/core/domain/errors/notfound-error';
import validator from 'validator';

describe('login usecase', () => {
  const makeSut = () => {
    const mockedUserRepository = new MockUserRepository();
    const loginUsecase = new LoginUseCase(mockedUserRepository);
    return loginUsecase;
  };

  test('should get name not found error', async () => {
    const sut = makeSut();
    const user = await CreateUser(GenerateUid.newUUID());
    expect(
      async () =>
        await sut.run({
          name: user.name,
          pass: user.pass,
        })
    ).rejects.toThrowError(new NotFoundError(`Perfil de nome '${user.name}'`));
  });
  test('should get incorrect pass error', async () => {
    const sut = makeSut();
    const user = await CreateUser(GenerateUid.newUUID());
    await new CreateAccountUsecase(new MockUserRepository()).run({
      name: user.name,
      pass: user.pass,
    });
    expect(
      async () =>
        await sut.run({
          name: user.name,
          pass: 'any_pass',
        })
    ).rejects.toThrowError(new DomainError('Senha incorreta.', 403));
  });
  test('should log in the user', async () => {
    const sut = makeSut();
    const user = await CreateUser(GenerateUid.newUUID());
    const createdUser = await new CreateAccountUsecase(new MockUserRepository()).run({
      name: user.name,
      pass: user.pass,
    });
    const response = await sut.run({
      name: user.name,
      pass: user.pass,
    });

    let tokenUser: {
      userId: string;
      userName: string;
    } = TokenGenerator.verifyToken(response).payload;

    expect(response).toBeTruthy();
    expect(validator.isJWT(response)).toEqual(true);
    expect(tokenUser.userId).toEqual(createdUser.id);
    expect(tokenUser.userName).toEqual(createdUser.name);
  });
});
