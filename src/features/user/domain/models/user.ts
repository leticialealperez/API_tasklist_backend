import { ITask } from "../../../tasklist/domain/models/task";

export interface IUser {
    id: string;
    name: string;
    pass: string;
    taskList: ITask[];
}
