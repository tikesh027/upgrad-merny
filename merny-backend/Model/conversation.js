const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
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
    }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;