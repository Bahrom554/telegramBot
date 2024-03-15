const { Bot, InputFile, InputMediaBuilder } = require("grammy");
const AppConfig = require('../config/app')();
const bot = new Bot(AppConfig.botToken);
const id = AppConfig.Chat_id;
const fs = require('fs');
const CONST = require('./utils/constants');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
class BotManager {
    constructor() {
        this.clientEvents();
    }

    async clientEvents() {
         
        // let mediaGroup = await this.loadMediaGroup(folderPath)

        // bot.api.sendMediaGroup(AppConfig.Chat_id, mediaGroup).then(data => {

        // }).catch(error => console.log("mgerror", error))

        bot.command("start", async (ctx) => {
            // bot.api.sendMediaGroup(id, mediaGroup);
            ctx.reply(".")
        });

        bot.on("callback_query", async (ctx) => {
            const action = ctx.callbackQuery.data;

            switch (action) {
                case CONST.callback_commands.email_created_sucess:
                    // sucess in email create call your function 
                    console.log("email_created_sucess")
                    await ctx.answerCallbackQuery({ text: "berilgan nameni yozing boshida  GV   bilan" });
                    break;
                case CONST.callback_commands.email_created_wrong:
                    // wrong in email create call your function 
                    console.log("email_created_wrong")
                    // await ctx.answerCallbackQuery({ text: "You clicked Button 2" });
                    break;
                case CONST.callback_commands.password_created_sucess:
                    this.sendPhoto(CONST.commands.two_steps_list,"some", (error) => {
                        console.log("error", error);
                    });
                    console.log("password_created_sucess")
                    break;
                case CONST.callback_commands.password_created_wrong:
                    // wrong in password create call your function 
                    console.log("pressed button 2")
                    // await ctx.answerCallbackQuery({ text: "You clicked Button 2" });
                    break;
                case CONST.callback_commands.two_step_password_sucess:
                    // wrong in two step create call your function 
                    console.log("two_step_password_sucess")
                    // await ctx.answerCallbackQuery({ text: "You clicked Button 2" });
                    break;
                case CONST.callback_commands.two_step_password_wrong:
                    // wrong in password create call your function 
                    console.log("two_step_password_wrong")
                    // await ctx.answerCallbackQuery({ text: "You clicked Button 2" });
                    break;
            }
        });

        bot.on('message', async (ctx) => {
            // Ensure the message has text content
            if ('text' in ctx.message) {
                const text = ctx.message.text;
                const firstChar = text.charAt(0);
                let name;
                switch (firstChar) {
                    case '7':
                        name = text.substring(1);
                        console.log("7",name)
                        break;
                    case '6':
                        name = text.substring(1);
                        console.log("6", name)
                        break;
                    case '5':
                        //no text
                        console.log("5", "no text")
                        break;
                    case '4':
                        // no text
                        console.log("4", "no text")
                        break;
                    case CONST.message.after_email_sucess_given_name:
                            // no text
                            console.log("4", "no text")
                            break;    
                }
            }
        });


        bot.start();
    }




    sendPhoto(command, text, cb) {
        switch (command) {
            case CONST.commands.login:
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step1.png')), { caption: "starting" }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                })
                break;
            case CONST.commands.email_create:
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step1.png')), {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Sucess", callback_data: CONST.callback_commands.email_created_sucess },
                            { text: "Wrong Email", callback_data: CONST.callback_commands.email_created_wrong }],
                        ],
                    }
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                })
                break;
            case CONST.commands.passwor_create:
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step2.png')), {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Sucess", callback_data: CONST.callback_commands.password_created_sucess },
                            { text: "Wrong Password", callback_data: CONST.callback_commands.password_created_wrong }],
                        ],
                    }
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                })
                break;
            case CONST.commands.two_steps_list:
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step7.png')), {
                    caption: "WRITE : 7  GALAXY NOTE10 5G",
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                });
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step6.png')), {
                    caption: "Write: 6  GALAXY NOTE10 5G",
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                });
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step5.png')), {
                    caption: "Write: 5 ",
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                });
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step4.png')), {
                    caption: "Write: 4 ",
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                });
                break;
            case CONST.commands.two_step_password_created:
                bot.api.sendPhoto(id, new InputFile(path.join(folderPath, 'step5.png')), {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Sucess", callback_data: CONST.callback_commands.two_step_password_sucess },
                            { text: "Wrong two step", callback_data: CONST.callback_commands.two_step_password_wrong }],
                        ],
                    }
                }).then(data => {
                    return cb(false);
                }).catch(error => {
                    return cb(error);
                })
                break;
        }
    }


    // loadMediaGroup(directoryPath) {
    //     return new Promise((resolve, reject) => {
    //         fs.readdir(directoryPath, (err, files) => {
    //             if (err) {
    //                 reject('Error reading the directory');
    //                 return;
    //             }
    //             let mediaGroup = [];
    //             let fileNames = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile());
    //             fileNames.forEach(file => {
    //                 mediaGroup.push(InputMediaBuilder.photo(new InputFile(path.join(directoryPath, file))));
    //             });
    //             resolve(mediaGroup);
    //         });
    //     });
    // }



}

module.exports = BotManager