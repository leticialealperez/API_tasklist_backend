import { IUser } from './user';

export interface IUserRepository {
  login(name: string): Promise<Partial<IUser> | undefined>;
  create(newUser: IUser): Promise<IUser>;
  findOneByName(name: string): Promise<IUser[]>;
}
