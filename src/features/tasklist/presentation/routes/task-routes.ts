import { Request, Response, Router } from 'express';
import { DeleteTaskUsecase } from '../../domain/usecases/delete-task/delete-task-usecase';
import { UpdateTaskController } from './../controllers/update-task-controller';
import { UpdateTaskUsecase } from '../../domain/usecases/update-task/update-task-usecase';
import { CreateTaskUsecase } from '../../domain/usecases/create-task/create-task-usecase';
import { ReadUserTasksUsecase } from '../../domain/usecases/read-user-tasks/read-user-tasks-usecase';
import { TaskRepository } from '../../infra/repository/task-repository';
import { CreateTaskController } from '../controllers/create-task-controller';
import { ReadUserTasksController } from '../controllers/read-user-tasks-controller';
import {
  createTaskMids,
  deleteTaskMids,
  editTaskMids,
  readUserTasksMids,
} from '../middlewares/task-middlewares';
import { DeleteTaskController } from '../controllers/delete-task-controller';
import { CacheRepository } from '../../../../core/infra/repositories/cache-repository';

export class TaskRouter {
  static getRoutes() {
    const routes = Router();

    const taskRepository = new TaskRepository();
    const cacheRepository = new CacheRepository();

    const readUserTasksUsecase = new ReadUserTasksUsecase(taskRepository, cacheRepository);
    const readUserTasksController = new ReadUserTasksController(readUserTasksUsecase);

    const createTaskUsecase = new CreateTaskUsecase(taskRepository, cacheRepository);
    const createTaskController = new CreateTaskController(createTaskUsecase);

    const updateTasksUsecase = new UpdateTaskUsecase(taskRepository, cacheRepository);
    const updateTaskController = new UpdateTaskController(updateTasksUsecase);

    const deleteTaskUsecase = new DeleteTaskUsecase(taskRepository, cacheRepository);
    const deleteTaskController = new DeleteTaskController(deleteTaskUsecase);

    routes.get('/readTasksByUserId', readUserTasksMids, (req: Request, res: Response) =>
      readUserTasksController.execute(req, res)
    );

    routes.post('/', createTaskMids, (req: Request, res: Response) =>
      createTaskController.execute(req, res)
    );

    routes.put('/', editTaskMids, (req: Request, res: Response) =>
      updateTaskController.execute(req, res)
    );

    routes.delete('/:id', deleteTaskMids, (req: Request, res: Response) =>
      deleteTaskController.execute(req, res)
    );

    return routes;
  }
}
