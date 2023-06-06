const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        require: true
    },
    url: {
        type: Schema.Types.String,
        require: true
    },
    text: {
        type: Schema.Types.String,
        require: true
    },
    content: {
        type: Schema.Types.String,
        require: true
    },
    image: {
        type: Schema.Types.String,
        require: true
    },
    isRead: {
        type: Schema.Types.Boolean,
        require: true
    }
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;