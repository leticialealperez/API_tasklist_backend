import { ReadUserTasksUsecase } from '../../domain/usecases/read-user-tasks/read-user-tasks-usecase';
import {
  ok,
  serverError,
} from '../../../../core/presentation/helper/http-handler';
import { Request, Response } from 'express';
import { Controller } from '../../../../core/presentation/contract/controller';

export class ReadUserTasksController implements Controller {
  constructor(private readUserTasksUsecase: ReadUserTasksUsecase) {}

  async execute(req: Request, res: Response) {
    try {
      let token = req.query.token as string;

      let data = {
        token,
      };

      let result = await this.readUserTasksUsecase.run(data);

      return ok(res, result);
    } catch (error) {
      return serverError(res, error);
    }
  }
}
