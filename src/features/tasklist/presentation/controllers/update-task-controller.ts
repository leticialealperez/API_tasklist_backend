import { ITask } from '../../domain/models/task';
import { ok, serverError } from '../../../../core/presentation/helper/http-handler';
import { Request, Response } from 'express';
import { Controller } from '../../../../core/presentation/contract/controller';
import { UpdateTaskUsecase } from '../../domain/usecases/update-task/update-task-usecase';
import { IUpdateTaskParams } from '../../domain/usecases/update-task/models/update-task-params';

export class UpdateTaskController implements Controller {
  constructor(private updateTaskUsecase: UpdateTaskUsecase) {}

  async execute(req: Request, res: Response) {
    try {
      let token: string = req.body.token;
      let id: string = req.body.id;
      let description: string = req.body.description;
      let detail: string = req.body.detail;

      let task: Partial<ITask> = {
        id,
        description,
        detail,
      };

      let data: IUpdateTaskParams = {
        token: token,
        task,
      };

      let result = await this.updateTaskUsecase.run(data);

      return ok(res, result, 200);
    } catch (error) {
      return serverError(res, error);
    }
  }
}
