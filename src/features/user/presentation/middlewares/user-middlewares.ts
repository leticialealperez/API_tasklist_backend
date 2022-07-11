import { Request, Response, NextFunction } from 'express';
import { ControllerError } from '../../../../core/presentation/error/controller-error';
import { serverError } from '../../../../core/presentation/helper/http-handler';

// middlewares para as rotas de Usuário
class UserInputValidations {
  static VerifyNameAndPass = (req: Request, res: Response, next: NextFunction) => {
    let name = req.body.name as string;
    let pass = req.body.pass as string;

    if (!name && !pass) {
      return serverError(res, new ControllerError('Informe um nome e uma senha.', 403));
    }
    if (!name) {
      return serverError(res, new ControllerError('Informe um nome.', 403));
    }
    if (!pass) {
      return serverError(res, new ControllerError('Informe uma senha.', 403));
    }

    next();
  };

  static VerifyRPass = (req: Request, res: Response, next: NextFunction) => {
    let pass = req.body.pass as string;
    let Rpass = req.body.Rpass as string;

    if (!Rpass) {
      return serverError(res, new ControllerError('Repita sua senha.', 403));
    }
    if (Rpass != pass) {
      return serverError(res, new ControllerError('Repita corretamente sua senha.', 403));
    }

    next();
  };

  static VerifyLenght = (req: Request, res: Response, next: NextFunction) => {
    let name = req.body.name as string;
    let pass = req.body.pass as string;

    if (Array.from(name).length < 5) {
      return serverError(
        res,
        new ControllerError(`O nome ${name} não possui o mínimo de 5 caracteres.`, 403)
      );
    }
    if (Array.from(pass).length < 5) {
      return serverError(
        res,
        new ControllerError(`A senha informada não possui o mínimo de 5 caracteres.`, 403)
      );
    }
    next();
  };
}

export let createAccMids = [
  // Middlewares para criação de conta
  UserInputValidations.VerifyNameAndPass,
  UserInputValidations.VerifyRPass,
  UserInputValidations.VerifyLenght,
];

export let loginMids = [
  // Middlewares para login
  UserInputValidations.VerifyNameAndPass,
  UserInputValidations.VerifyLenght,
];
