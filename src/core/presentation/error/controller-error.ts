export class ControllerError extends Error {
    public readonly code: number;

    constructor(error: string, code?: number) {
        super(error);
        this.name = "ControllerError";
        this.code = code ?? 400;
    }
}
