import { CacheRepository } from './../../../../core/infra/repositories/cache-repository';
import { Request, Response, Router } from 'express';
import { UserRepository } from '../../infra/repository/user-repository';
import { UserCreateController } from '../controllers/user-create-controller';
import { UserLoginController } from '../controllers/user-login-controller';
import { createAccMids, loginMids } from '../middlewares/user-middlewares';
import { CreateAccountUsecase } from '../../domain/usecases/create-account/create-account-usecase';
import { LoginUseCase } from '../../domain/usecases/login/login-usecase';

export class UserRouter {
    static getRoutes() {
        const routes = Router();

        const userRepository = new UserRepository();

        const createAccountUsecase = new CreateAccountUsecase(userRepository);
        const createAccountController = new UserCreateController(createAccountUsecase);

        const loginUsecase = new LoginUseCase(userRepository);
        const loginController = new UserLoginController(loginUsecase);

        routes.post('/', createAccMids, (req: Request, res: Response) =>
            createAccountController.execute(req, res)
        );

        routes.post('/login', loginMids, (req: Request, res: Response) =>
            loginController.execute(req, res)
        );

        return routes;
    }
}
