import { Request, Response } from "express";
import { ok, serverError } from "../../../../core/presentation/helper/http-handler";
import { Controller } from "../../../../core/presentation/contract/controller";
import { LoginUseCase } from "../../domain/usecases/login/login-usecase";

export class UserLoginController implements Controller {
    constructor(private loginUseCase: LoginUseCase) {}

    async execute(req: Request, res: Response) {
        try {
            const token = await this.loginUseCase.run({
                name: req.body.name,
                pass: req.body.pass,
            });

            return ok(res, token);
        } catch (error) {
            return serverError(res, error);
        }
    }
}
