import { ITask } from "../../../models/task";

export interface ICreateTaskParams {
    token: string;
    task: Partial<ITask>;
}
