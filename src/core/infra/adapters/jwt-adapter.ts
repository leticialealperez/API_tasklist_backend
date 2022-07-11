import jwt, { JwtPayload } from "jsonwebtoken";
import { ILoginPayload } from "../../../features/user/domain/usecases/login/models/login-payload";

export class TokenGenerator {
    static newToken(payload: ILoginPayload): string {
        return jwt.sign({ payload: payload }, process.env.SCRT as string, { expiresIn: "1h" });
    }

    static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.SCRT as string) as JwtPayload;
    }
}
