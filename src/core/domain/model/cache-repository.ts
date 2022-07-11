import { ITask } from "../../../features/tasklist/domain/models/task";

export interface ICacheRepository {
    set(key: string, value: any): Promise<"OK">;
    get(key: string): Promise<ITask[] | undefined>;
    flush(): Promise<"OK">;
}
