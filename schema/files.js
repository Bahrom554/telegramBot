const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    originalname: String,
    name: String,
    fileUrl: String,
    mimetype:String,
    path:String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
fileSchema.plugin(mongoosePaginate);
fileSchema.pre('save', function (next) {
    next();
});

fileSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.__v;
    return obj;
   }








module.exports = mongoose.model('File', fileSchema);












