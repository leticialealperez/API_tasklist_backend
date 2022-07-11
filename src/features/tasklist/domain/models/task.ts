export interface ITask {
    id: string;
    description: string;
    detail: string;
    user_id: string;
    created_at?: Date;
    updated_at?: Date;
}
