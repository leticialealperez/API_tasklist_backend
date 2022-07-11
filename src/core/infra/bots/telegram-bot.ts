import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export class TelegramBot {
    private BOT_TOKEN: string;
    private CHAT_ID: string;
    bot: Telegraf<Context<Update>>;
    constructor() {
        this.BOT_TOKEN = process.env.BOT_TOKEN as string;
        this.CHAT_ID = process.env.CHAT_ID as string;
        this.bot = new Telegraf(this.BOT_TOKEN);
    }

    newUserMessage = (userName: string) => {
        return this.bot.telegram.sendMessage(
            this.CHAT_ID,
            `
Novo usuário criado! 
Username: '${userName}'
`
        );
    };

    loginUserMessage = (userName: string) => {
        return this.bot.telegram.sendMessage(
            this.CHAT_ID,
            `
Usuário logado: '${userName}'
`
        );
    };

    newTaskMessage = (userName: string, taskDescription: string, taskDetail: string) => {
        return this.bot.telegram.sendMessage(
            this.CHAT_ID,
            `
Nova tarefa criada:
Usuário: '${userName}'
Descrição: '${taskDescription}'
Detalhamento: '${taskDetail}'
`
        );
    };

    updateTaskMessage = (userName: string, taskDescription: string, taskDetail: string) => {
        return this.bot.telegram.sendMessage(
            this.CHAT_ID,
            `
Tarefa editada:
Usuário: '${userName}'
Descrição: '${taskDescription}'
Detalhamento: '${taskDetail}'
`
        );
    };

    deleteTaskMessage = (userName: string) => {
        return this.bot.telegram.sendMessage(
            this.CHAT_ID,
            `
Tarefa deletada:
Usuário: '${userName}'
`
        );
    };
}
