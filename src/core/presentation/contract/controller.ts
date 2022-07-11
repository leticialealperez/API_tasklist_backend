import { Request, Response } from "express";

export interface Controller {
    execute(req: Request, res: Response): Promise<any>;
}
