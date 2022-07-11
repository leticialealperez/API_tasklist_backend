import { Controller } from './../../../../core/presentation/contract/controller';
import { Request, Response } from 'express';
import { ok, serverError } from '../../../../core/presentation/helper/http-handler';
import { CreateAccountUsecase } from '../../domain/usecases/create-account/create-account-usecase';
import { ICreateAccountParams } from '../../domain/usecases/create-account/models/create-account-params';

export class UserCreateController implements Controller {
  constructor(private createAccountUsecase: CreateAccountUsecase) {}

  async execute(req: Request, res: Response) {
    try {
      let newUser: ICreateAccountParams = {
        name: req.body.name,
        pass: req.body.pass,
      };

      let result = await this.createAccountUsecase.run(newUser);

      return ok(res, `Conta de '${newUser.name}' criada com sucesso.`, 201);
    } catch (error) {
      return serverError(res, error);
    }
  }
}
