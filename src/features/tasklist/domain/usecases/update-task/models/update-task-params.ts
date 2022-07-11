import { ITask } from "../../../models/task";

export interface IUpdateTaskParams {
    token: string;
    task: Partial<ITask>;
}
