const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const chatSchema = new Schema({
        telegram_id: {
            type: String,
            unique: true
        },
        first_name: String,
        last_name: String,
        username: {
            type: String,
            unique: true
        },
        phone: String,
        status: {
            type: Boolean,
            default: 1
        },
    },
    {
        timestamps: {

            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }

    });

chatSchema.plugin(mongoosePaginate);
chatSchema.pre('save', function (next) {
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;