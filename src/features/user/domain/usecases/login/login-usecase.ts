import { DomainError } from './../../../../../core/domain/errors/domain-error';
import { UseCase } from '../../../../../core/domain/contract/usecase';
import { IUser } from '../../models/user';
import { NotFoundError } from '../../../../../core/domain/errors/notfound-error';
import { SecurePassword } from '../../../infra/adapters/passCriptography';
import { TokenGenerator } from '../../../../../core/infra/adapters/jwt-adapter';
import { ILoginParams } from './models/login-params';
import { ILoginPayload } from './models/login-payload';
import { IUserRepository } from '../../models/user-repository';

export class LoginUseCase implements UseCase {
  constructor(private repository: IUserRepository) {}

  async run(data: ILoginParams) {
    let user: IUser[] = await this.repository.findOneByName(data.name);

    // verifica se existe perfil com o nome informado
    if (user[0] == undefined)
      throw new NotFoundError(`Perfil de nome '${data.name}'`);

    // verifica se a hash da senha do perfil é a mesma da hash da senha informada
    if (!SecurePassword.compare(data.pass, user[0].pass))
      throw new DomainError('Senha incorreta.', 403);

    // retorna o user logado
    let loggedUser: Partial<IUser | undefined> = await this.repository.login(
      data.name
    );

    // gera um payload e envia no token jwt
    let userName = loggedUser?.name as string;
    let userId = loggedUser?.id as string;
    let payload: ILoginPayload = {
      userId,
      userName,
    };
    let token = TokenGenerator.newToken(payload);

    return { payload, token };
  }
}
