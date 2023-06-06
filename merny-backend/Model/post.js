const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: {
        type: Schema.Types.String,
        require: true
    },
    image: {
        type: Schema.Types.Array,
        require: true
    },
    like: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comments'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;