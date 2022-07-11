import { ok, serverError } from "../../../../core/presentation/helper/http-handler";
import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contract/controller";
import { DeleteTaskUsecase } from "../../domain/usecases/delete-task/delete-task-usecase";
import { IDeleteTaskParams } from "../../domain/usecases/delete-task/models/delete-task-params";

export class DeleteTaskController implements Controller {
    constructor(private deleteTaskUsecase: DeleteTaskUsecase) {}

    async execute(req: Request, res: Response) {
        try {
            let token = JSON.parse(req.query.token as string);
            let id = req.query.id as string;

            let data: IDeleteTaskParams = {
                token,
                id,
            };

            let result = await this.deleteTaskUsecase.run(data);

            return ok(res, result);
        } catch (error) {
            return serverError(res, error);
        }
    }
}
