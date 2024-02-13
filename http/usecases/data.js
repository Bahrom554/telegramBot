const Chat = require('../../schema/chats');
const Message = require('../../schema/message');
const Queue = require('bull');
const sendMessageQueue = new Queue('sendMessageQueue', 'redis://127.0.0.1:6379');
const sendMediaGroupQueue = new Queue('sendMediaGroupQueue', 'redis://127.0.0.1:6379');
const uuid = require('uuid');
const botManager = new (require('../../bot/botManager'));


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

exports.saveAndSend = async function (data, files, bot) {
    try {
        let List = [];
        let file_id = uuid.v4();
        if (files && files.length > 0) {
            files.forEach(file => {
                List.push({
                    message: data.message,
                    file: file,
                    file_id: file_id
                })
            });

            await Message.insertMany(List);
            createJob(file_id);
        }
        else {

            await Message.create({ message: data.message });
            createJob(file_id);

        }

    } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err
    }

}

async function createJob(file_id = null) {
    let chats = await Chat.find({ status: true });
    let messages = await Message.find({ is_sent: false, file_id: file_id });

    if (!file_id) {
        messages.forEach(message => {
            chats.forEach(chat => {
                sendMessageQueue.add({ message, chat });
            });

        });
    } else {
        chats.forEach(chat => {
            sendMediaGroupQueue.add({ messages: messages, chat });
        })
    }
}

sendMessageQueue.process(async function(job, done){
let message = job.data.message;
let chat = job.data.chat;
try{

} catch{}







})
