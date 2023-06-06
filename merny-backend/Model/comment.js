const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    content: {
        type: Schema.Types.String,
        require: true
    },
    tag: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    reply: {
        type: [mongoose.Types.ObjectId],
        require: true,
        ref: 'Comments'
    },
    likes: {
        type: [mongoose.Types.ObjectId],
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    postId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'Post'
    },
    postUserId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, { timestamps: true });

const Comments = mongoose.model('Comments', CommentsSchema);
module.exports = Comments;

/*
 new comment
 {
    _id: 1234,
    likes: [],
    postId: Post123,
    userId: User123,
    reply: [],
    content: "NEW"
 }

 Reply
 {
    _id: reply123,
    reply: [],
    content: "Reply",
    postId: Post123,
    user: User123,
 }

*/