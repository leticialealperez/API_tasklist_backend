export class DomainError extends Error {
    public readonly code: number;

    constructor(error: string, code?: number) {
        super(error);
        this.name = "DomainError";
        this.code = code ?? 418;
    }
}
