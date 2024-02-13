const Chat = require('../../schema/chats');
const Message = require('../../schema/message');
const mongoose = require('mongoose');
const Queue = require('bull');
const sendMessageQueue = new Queue('sendMessageQueue', 'redis://127.0.0.1:6379');
const sendMediaGroupQueue = new Queue('sendMediaGroupQueue', 'redis://127.0.0.1:6379');
const uuid = require('uuid');
const botManager = new (require('../../bot/botManager'));
const CONST = require('../../utils/constants');
const { text } = require('express');


exports.getUsers = async function (page, limit, search) {
    let query = {}
    const options = {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    };

    if (search)
        query["$or"] = [
            {
                first_name: RegExp(search, 'i')
            }, {
                username: RegExp(search, 'i')
            },
            {
                last_name: RegExp(search, 'i')
            }
        ]


    return Chat.paginate(query, options)
}

exports.geMessages = async function (page, limit, search) {
    let query = {}
    const options = {
        page: page,
        limit: limit,
        sort: { created_at: -1 },
    };

    if (search)
        query =
        {
            message: RegExp(search, 'i')
        }



    return Message.paginate(query, options)
}

exports.saveAndSend = async function (data, files) {
    try {
    //    return await Message.deleteMany({});
        let List = [];
        let file_id = null;
        let single = true;
        if (files && files.length > 0) {
            if (files.length > 1) { single = false; }
            file_id = uuid.v4();
            files.forEach(file => {
                List.push({
                    message: data.message,
                    file: file,
                    file_id: file_id,
                    type: data.type

                })
            });

            await Message.insertMany(List);
        }
        else {
            await Message.create({ message: data.message, type: data.type });


        }
        createJob(file_id, single);

        return { message: "ok" };

    } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err
    }

}

async function createJob(file_id, single) {
    let chats = await Chat.find({ status: true });
    let messages;
    if (single) {
        messages = await Message.find({ is_sent: false, type: { $ne: CONST.message.group } });
        messages.forEach(message => {
            chats.forEach(chat => {
                sendMessageQueue.add({ message, chat });
            });
        });
    } else {
        messages = await Message.find({ is_sent: false, file_id: file_id });
        chats.forEach(chat => {
            sendMediaGroupQueue.add({ messages, chat });
        })

    }

}

sendMessageQueue.process(async function (job, done) {
    let message = job.data.message;
    let chat = job.data.chat;
    botManager.sendSingle(chat.telegram_id, message, async(error) => {
        if (!error) {
            Message.updateOne({ _id: message._id }, { $inc: { sent_count: 1 }, is_sent: true }).then(data=>{});
        }
        else {
        }
    })
    done()
})


sendMediaGroupQueue.process(async function (job, done) {
    let messages = job.data.messages;
    let chat = job.data.chat;
    botManager.sendMediaGroup(chat.telegram_id, messages, async(error, ids) => {
        if (!error) {
           Message.updateMany({ _id: { $in: ids } }, { $inc: { sent_count: 1 }, is_sent: true }).then(data=>{});
          console.log("status", a)
        }
        else {
        }
    })


done()

})

sendMessageQueue.on('completed', (job) => {
    job.remove()
      .then(() => {
        console.log(`Removed completed job ${job.id}`);
      })
      .catch((err) => {
        console.error(`Could not remove completed job ${job.id}`, err);
      });
  });

  sendMediaGroupQueue.on('completed', (job) => {
    job.remove()
      .then(() => {
        console.log(`Removed completed job ${job.id}`);
      })
      .catch((err) => {
        console.error(`Could not remove completed job ${job.id}`, err);
      });
  });