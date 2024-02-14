const Chat = require('../../schema/chats');
const Message = require('../../schema/message');
const mongoose = require('mongoose');
const Queue = require('bull');
const DatabaseConfig = require('../../config/database')
const sendMessageQueue = new Queue('sendMessageQueue', `redis://${DatabaseConfig.rHost}:${DatabaseConfig.rPort}`);
const sendMediaGroupQueue = new Queue('sendMediaGroupQueue', `redis://${DatabaseConfig.rHost}:${DatabaseConfig.rPort}`);
const uuid = require('uuid');
const botManager = new (require('../../bot/botManager'));
const CONST = require('../../utils/constants');
const File = require('../../schema/files');


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
        populate: 'files',
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
        // await File.deleteMany({});
        // return await Message.deleteMany({});
        let message;
        let list=[];
        if (files && files.length) {
            files.forEach(file => {
                    list.push({
                    originalname: file.originalname,
                    fileUrl: 'uploads/' + file.filename,
                    path: file.path,
                    name: file.filename,
                    mimetype: file.mimetype
                })
            })

            let _files = await File.insertMany(list);
           
            const fileIds = _files.map(file => file._id);
            message = await Message.create({ message: data.message, type: data.type, files: fileIds });
        }
        else {
            message = await Message.create({ message: data.message, type: data.type });
        }
        createJob();
        return message;

    } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err
    }

}

async function createJob() {
    let chats = await Chat.find({ status: true });
    let messages = await Message.find({ is_sent: false }).populate('files');
    messages.forEach(message => {
        chats.forEach(chat => {
            if(message.files && message.files.length > 1)
            {
                sendMediaGroupQueue.add({message, chat});
            }
            else{
                sendMessageQueue.add({ message, chat });
            }
        });
        
    });

}

sendMessageQueue.process(async function (job, done) {
    let message = job.data.message;
    let chat = job.data.chat;

    botManager.sendSingle(chat.telegram_id, message, 0, async (error) => {
        if (!error) {
            Message.updateOne({ _id: message._id }, { $inc: { sent_count: 1 }, is_sent: true }).then(data => { });
        }
        else {
        }
    })
    done()
})


sendMediaGroupQueue.process(async function (job, done) {
    let message = job.data.message;
    let chat = job.data.chat;
    botManager.sendMediaGroup(chat.telegram_id, message, async (error) => {
        if (!error) {
            Message.updateOne({ _id: message._id }, { $inc: { sent_count: 1 }, is_sent: true }).then(data => { });
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