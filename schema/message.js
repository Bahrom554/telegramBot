const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const messageSchema = new Schema({
    file: {},
    type:{
        type: String,
        default: 'text'
    },
    file_id: {
        type: String,
        default: null
    },
    message: String,

    is_sent: {
        type: Boolean,
        default: false
    },
    sent_count: {
        type: Number,
        min: 0,
        default: 0,
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

messageSchema.plugin(mongoosePaginate);
messageSchema.pre('save', function (next) {
    next();
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;