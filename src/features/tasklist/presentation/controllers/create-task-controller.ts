import { ok, serverError } from '../../../../core/presentation/helper/http-handler';
import { Request, Response } from 'express';
import { Controller } from '../../../../core/presentation/contract/controller';
import { CreateTaskUsecase } from '../../domain/usecases/create-task/create-task-usecase';
import { ITask } from '../../domain/models/task';
import { ICreateTaskParams } from '../../domain/usecases/create-task/models/create-task-params';

export class CreateTaskController implements Controller {
  constructor(private createTasksUsecase: CreateTaskUsecase) {}

  async execute(req: Request, res: Response) {
    try {
      let token: string = req.body.token;
      let description: string = req.body.description;
      let detail: string = req.body.detail;

      let task: Partial<ITask> = {
        description,
        detail,
      };

      let data: ICreateTaskParams = {
        token: token,
        task,
      };

      let result = await this.createTasksUsecase.run(data);

      return ok(res, result, 201);
    } catch (error) {
      return serverError(res, error);
    }
  }
}
