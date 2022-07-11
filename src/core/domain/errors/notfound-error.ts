import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
    constructor(data: string) {
        super(`${data} não encontrado.`, 404);
        this.name = "NotFoundError";
    }
}
