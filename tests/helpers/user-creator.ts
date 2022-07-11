import { GenerateUid } from '../../src/core/infra/adapters/uuidGenerator';
import { IUser } from '../../src/features/user/domain/models/user';
import { SecurePassword } from '../../src/features/user/infra/adapters/passCriptography';
import { UserRepository } from './../../src/features/user/infra/repository/user-repository';

export const CreateUserInDB: (userName?: string) => Promise<IUser> = async (userName?: string) => {
  const userRepository = new UserRepository();
  return await userRepository.create({
    id: GenerateUid.newUUID(),
    name: userName ? userName : GenerateUid.newUUID(),
    pass: SecurePassword.encrypt('any_pass'),
    taskList: [],
  });
};

export const CreateUser: (userName?: string) => Promise<IUser> = async (userName?: string) => {
  return {
    id: GenerateUid.newUUID(),
    name: userName ? userName : GenerateUid.newUUID(),
    pass: SecurePassword.encrypt('any_pass'),
    taskList: [],
  };
};


