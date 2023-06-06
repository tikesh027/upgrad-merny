const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: Schema.Types.String,
    require: true,
  },
  username: {
    type: Schema.Types.String,
    require: true,
  },
  email: {
    type: Schema.Types.String,
    unique: true,
    require: true,
  },
  password: {
    type: Schema.Types.String,
    require: true,
  },
  avatar: {
    type: Schema.Types.String,
  },
  role: {
    type: Schema.Types.String,
    require: true,
  },
  gender: {
    type: Schema.Types.String,
    require: true,
  },
  mobile: {
    type: Schema.Types.String,
    require: true,
  },
  address: {
    type: Schema.Types.String,
    require: true,
  },
  bio: {
    type: Schema.Types.String,
    require: true,
  },
  website: {
    type: Schema.Types.String,
    require: true,
  },
  follower: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    unique: true,
    require: true,
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    require: true,
  },
  saved: {
    type: [Schema.Types.ObjectId],
    ref: 'Post',
    require: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;