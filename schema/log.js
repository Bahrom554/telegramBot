const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const logSchema = new Schema({
method:String,
payload: {},
type: String,
description: String,
error_code:Number
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
logSchema.plugin(mongoosePaginate);
logSchema.pre('save', function (next) {
    next();
});

module.exports = mongoose.model('Log', logSchema);