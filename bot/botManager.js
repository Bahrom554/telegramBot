let bot = null;
const Chat = require('../schema/chats');

class BotManager {
    constructor(BOT) {
        bot = BOT;
        this.clientEvents();
    }

    clientEvents() {
        bot.command("start", async (ctx) => {
            let _chat = ctx.chat;
            let chat = await Chat.findOne({ telegram_id: _chat.id });
            if (!chat) {
                chat = await Chat.create({ telegram_id: _chat.id, first_name: _chat.first_name, last_name: _chat.last_name, username: _chat.username })
            } else if (!chat.status) {
                chat.status = 1;
                await chat.save();
            }
            ctx.reply("Welcome! Up and running.")
        });

        bot.command("stop", (ctx) => {

            console.log("stop:", ctx)

            ctx.reply("Got another message!")
        });
        bot.start();
    }

    async sendMessage(id, text) {
        try {
            return await bot.api.sendMessage(id, text);

        } catch (error) {
            error.statusCode = error.statusCode || 500;
            throw error;
        }

    }

}

module.exports = BotManager