import { TokenGenerator } from './../../../../core/infra/adapters/jwt-adapter';
import { Request, Response, NextFunction } from 'express';
import { ControllerError } from '../../../../core/presentation/error/controller-error';
import { serverError } from '../../../../core/presentation/helper/http-handler';
import { NotAuthorizedError } from '../../domain/errors/token-error';

// middlewares para as rotas

class TaskMiddlewares {
  static VerifyFields = (req: Request, res: Response, next: NextFunction) => {
    let description = req.body.description as string;
    let detail = req.body.detail as string;

    if (!description && !detail) {
      return serverError(res, new ControllerError('Insira uma descrição e um detalhamento.', 403));
    } else if (!description) {
      return serverError(res, new ControllerError('Insira uma descrição.', 403));
    } else if (!detail) {
      return serverError(res, new ControllerError('Insira um detalhamento.', 403));
    }
    next();
  };

  static VerifyMaxLenght = (req: Request, res: Response, next: NextFunction) => {
    let description = req.body.description as string;
    let detail = req.body.detail as string;

    if (Array.from(description).length > 50) {
      return serverError(
        res,
        new ControllerError(
          `A descrição não pode exceder 50 caracteres. Sua descrição possui ${
            Array.from(description).length
          } caracteres.`,
          403
        )
      );
    }
    if (Array.from(detail).length > 500) {
      return serverError(
        res,
        new ControllerError(
          `O detalhamento não pode exceder 500 caracteres. Seu detalhamento possui ${
            Array.from(detail).length
          } caracteres.`,
          403
        )
      );
    }

    next();
  };

  static VerifyBodyId = (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.body.id;

    if (!id) {
      return serverError(res, new ControllerError('Id da tarefa não informado.', 403));
    }
    next();
  };

  static VerifyQueryId = (req: Request, res: Response, next: NextFunction) => {
    let id = req.query.id as string;

    if (!id) {
      return serverError(res, new ControllerError('Id da tarefa não informado.', 403));
    }
    next();
  };

  static VerifyBodyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.body.token as string;
    if (!token) {
      return serverError(
        res,
        new ControllerError('Usuário sem token, necessário novo login.', 403)
      );
    }
    try {
      TokenGenerator.verifyToken(token);
    } catch (error) {
      return serverError(res, new NotAuthorizedError(error as Error));
    }
    next();
  };

  static VerifyQueryToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.query.token as string;
    if (!token) {
      return serverError(
        res,
        new ControllerError('Usuário sem token, necessário novo login.', 403)
      );
    }
    token = JSON.parse(token);
    try {
      TokenGenerator.verifyToken(token);
    } catch (error) {
      return serverError(res, new NotAuthorizedError(error as Error));
    }
    next();
  };
}

export let deleteTaskMids = [
  //
  TaskMiddlewares.VerifyQueryId,
  TaskMiddlewares.VerifyQueryToken,
];

export let createTaskMids = [
  //
  TaskMiddlewares.VerifyFields,
  TaskMiddlewares.VerifyMaxLenght,
  TaskMiddlewares.VerifyBodyToken,
];

export let editTaskMids = [
  //
  TaskMiddlewares.VerifyBodyId,
  TaskMiddlewares.VerifyFields,
  TaskMiddlewares.VerifyMaxLenght,
  TaskMiddlewares.VerifyBodyToken,
];

export let readUserTasksMids = [
  //
  TaskMiddlewares.VerifyQueryToken,
];
