import { DomainError } from "../../../../core/domain/errors/domain-error";

export class InvalidPasswordError extends DomainError {
    constructor() {
        super("Senha inválida.", 403);
        this.name = "InvalidPasswordError";
    }
}
