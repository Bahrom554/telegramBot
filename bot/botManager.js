const {Bot} = require("grammy");
const bot = new Bot("6526252078:AAEws_Mf0oiedlR1ykXp2pEfMkHDI8Ofx3Q");
const Chat = require('../schema/chats');

class BotManager {
    constructor() {
        this.clientEvents();
    }

    clientEvents() {
        bot.command("start", async (ctx) => {
            console.log("here")
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

        bot.on("message", (ctx) => ctx.reply("Got another message!"));

        bot.start();
    }

    sendMessage(id, text, cb) {
            bot.api.sendMessage(id, text).then(data => {
                return cb(false);
            }).catch(error => {
                if (error.error_code == 403) {
                    Chat.updateOne({ _id: id }, { status: 0 });
                }
                return cb(error);
            })
    }
    sendMediaGroup(id, mediaGroup, files, cb ){

         bot.api.sendMediaGroup(id, mediaGroup, files).then(data => {
            return cb(false);
        }).catch(error => {
            if (error.error_code == 403) {
                Chat.updateOne({ _id: id }, { status: 0 });
            }
            return cb(error);
        })
    }

}

module.exports = BotManager