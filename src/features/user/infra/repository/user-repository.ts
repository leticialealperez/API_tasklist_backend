import { Repository } from 'typeorm';
import { DatabaseConnection } from '../../../../core/infra/database/connections/connection';
import { User } from '../../../../core/infra/database/entities/User';
import { IUser } from '../../domain/models/user';
import { IUserRepository } from '../../domain/models/user-repository';

export class UserRepository implements IUserRepository {
  private userRepository: Repository<IUser>;

  constructor() {
    this.userRepository = DatabaseConnection.getConnection().manager.getRepository(User);
  }

  async findOneByName(name: string): Promise<IUser[]> {
    return await this.userRepository.find({ name: name });
  }

  async login(name: string): Promise<Partial<IUser>> {
    let userArr = await this.findOneByName(name);
    let user = userArr[0];
    return user;
  }

  async create(newUser: IUser): Promise<IUser> {
    let newUserEntity = this.userRepository.create(newUser);
    let response = await this.userRepository.save(newUserEntity);
    return response;
  }
}
