import { DomainError } from "../../../../core/domain/errors/domain-error";

export class DuplicatedUserError extends DomainError {
    constructor(name: string) {
        super(`O nome '${name}' não está disponível.`, 403);
        this.name = "DuplicatedUserError";
    }
}
