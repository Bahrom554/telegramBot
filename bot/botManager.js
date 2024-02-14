const { Bot, InputFile, InputMediaBuilder } = require("grammy");
const AppConfig =require('../config/app')()
const bot = new Bot(AppConfig.botToken);
const Chat = require('../schema/chats');
const CONST = require('../utils/constants')
class BotManager {
    constructor() {
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

        bot.on("message", (ctx) => ctx.reply("Got another message!"));

        bot.start();
    }

    sendSingle(id, message, i, cb) {
        let text = i? null : message.message;
        let path = message?.files[i]?.path || null;
        message.type = path ? message.type : CONST.message.text;
        switch (message.type) {
            case CONST.message.audio:
                bot.api.sendAudio(id, new InputFile(path), { caption: text }).then(data => {
                    return cb(false);
                }).catch(error => {
                    if (error.error_code == 403) {
                        Chat.updateOne({ telegram_id: id }, { status: 0 });
                    }
                    return cb(error);
                })
                break;
            case CONST.message.doc:
                bot.api.sendDocument(id, new InputFile(path), { caption: text }).then(data => {
                    return cb(false);
                }).catch(error => {
                    if (error.error_code == 403) {
                        Chat.updateOne({ telegram_id: id }, { status: 0 });
                    }
                    return cb(error);
                })
                break;
            case CONST.message.photo:
                bot.api.sendPhoto(id, new InputFile(path), { caption: text }).then(data => {
                    return cb(false);
                }).catch(error => {
                    if (error.error_code == 403) {
                        Chat.updateOne({ telegram_id: id }, { status: 0 });
                    }
                    return cb(error);
                })
                break;
            case CONST.message.video:
                bot.api.sendVideo(id, new InputFile(path), {
                    caption: text, supports_streaming: true,
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    if (error.error_code == 403) {
                        Chat.updateOne({ telegram_id: id }, { status: 0 });
                    }
                    return cb(error);
                })
                break;
            case CONST.message.text:
                bot.api.sendMessage(id, text).then(data => {
                    return cb(false);
                }).catch(error => {
                    if (error.error_code == 403) {
                        Chat.updateOne({ telegram_id: id }, { status: 0 });
                    }
                    return cb(error);
                })
                break;
        }
    }

    sendMediaGroup(id, message, cb) {
        let mediaGroup = [];
        let ids = [];
        let captionWrited = false;
        let files = message.files;
        let err =null;
        for (let i = 0; i < files.length; i++) {
            let path = files[i]?.path || null;
            if (files[i]?.mimetype.startsWith("image")) {
                if (!captionWrited && message.message) {
                    mediaGroup.push(InputMediaBuilder.photo(new InputFile(path), { caption: message.message }))
                    captionWrited = true;
                }
                else {
                    mediaGroup.push(InputMediaBuilder.photo(new InputFile(path)))
                }

            } else if (files[i]?.mimetype.startsWith("video")) {

                if (!captionWrited && message.message) {
                    mediaGroup.push(InputMediaBuilder.video(new InputFile(path), { caption: message.message }))
                    captionWrited = true;
                }
                else {
                    mediaGroup.push(InputMediaBuilder.video(new InputFile(path)))
                } 

            } else {
                this.sendSingle(id, message, i, (error)=>{
                    if(error){err = error}
                })
                if(err) break;
            }
        }
        if (!mediaGroup.length) return cb(err);
          bot.api.sendMediaGroup(id, mediaGroup).then(data => {
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