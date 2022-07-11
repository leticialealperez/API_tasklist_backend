import { IUser } from './../../../../src/features/user/domain/models/user';
import { DuplicatedUserError } from './../../../../src/features/user/domain/errors/duplicated-user';
import { ICreateAccountParams } from './../../../../src/features/user/domain/usecases/create-account/models/create-account-params';
import { CreateAccountUsecase } from '../../../../src/features/user/domain/usecases/create-account/create-account-usecase';
import { CreateUser } from '../../../helpers/user-creator';
import { MockUserRepository } from '../infra/repository/user-repository.test';
import validator from 'validator';
import { SecurePassword } from '../../../../src/features/user/infra/adapters/passCriptography';

describe('user usecase', () => {
  const makeSut = () => {
    const mockedUserRepository = new MockUserRepository();
    const createAccountUsecase = new CreateAccountUsecase(mockedUserRepository);
    return createAccountUsecase;
  };

  test('should get duplicate name error', async () => {
    const sut = makeSut();
    const createAccountParams: ICreateAccountParams = {
      name: 'test',
      pass: 'test',
    };
    expect(async () => await sut.run(createAccountParams)).rejects.toThrowError(
      DuplicatedUserError
    );
  });

  test('should create an user', async () => {
    const sut = makeSut();
    const createAccountParams: ICreateAccountParams = {
      name: 'any_name',
      pass: 'any_pass',
    };
    const user: IUser = await sut.run(createAccountParams);
    expect(user.name).toEqual(createAccountParams.name);
    expect(validator.isUUID(user.id, 4)).toEqual(true);
    expect(user.taskList.length).toEqual(0);
  });
});
