import bcrypt from "bcrypt";

export class SecurePassword {
    static encrypt(data: string): string {
        return bcrypt.hashSync(data, 13);
    }

    static compare(pass: string, securedPass: string): boolean {
        return bcrypt.compareSync(pass, securedPass);
    }
}
