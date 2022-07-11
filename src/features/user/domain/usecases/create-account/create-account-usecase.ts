import { DuplicatedUserError } from "../../errors/duplicated-user";
import { UseCase } from "../../../../../core/domain/contract/usecase";
import { IUser } from "../../models/user";
import { SecurePassword } from "../../../infra/adapters/passCriptography";
import { GenerateUid } from "../../../../../core/infra/adapters/uuidGenerator";
import { ICreateAccountParams } from "./models/create-account-params";
import { TelegramBot } from "../../../../../core/infra/bots/telegram-bot";
import { IUserRepository } from "../../models/user-repository";

export class CreateAccountUsecase implements UseCase {
    constructor(private repository: IUserRepository) {}

    async run(data: ICreateAccountParams) {
        // verifica duplicidade de contas
        let arrayDeUsers = (await this.repository.findOneByName(data.name)) as IUser[];
        let user = arrayDeUsers[0];
        if (user) throw new DuplicatedUserError(data.name);

        // cria o novo usuário
        let newUser: IUser = {
            id: GenerateUid.newUUID(),
            name: data.name,
            pass: SecurePassword.encrypt(data.pass),
            taskList: [],
        };

        // bot que envia o nome do novo usuário
        new TelegramBot().newUserMessage(newUser.name);

        // salva o usuário
        return await this.repository.create(newUser);
    }
}
