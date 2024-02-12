const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const contentSchema = new Schema({
        file: String,
        message: String,
        file_type: Number,
        is_sent: {
            type: Boolean,
            default: false
        },
        file_id: String,
        sent_count: {
            type: Number,
            min: 0,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: props => `${props.value} is not an integer value`
            }
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

contentSchema.plugin(mongoosePaginate);
contentSchema.pre('save', function (next) {
    next();
});
const Content = mongoose.model('Content', contentSchema);
module.exports = Content;