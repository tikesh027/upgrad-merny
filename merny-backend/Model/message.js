const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversation: {
        type: ObjectId,
        require: true
    },
    sender: {
        type: ObjectId,
        require: true
    },
    recipients: {
        type: ObjectId,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    media: {
        type: Array,
        require: true
    },
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;