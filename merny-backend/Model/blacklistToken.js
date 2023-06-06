const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlacklistTokenSchema = new Schema({
    token: {
        type: Schema.Types.String,
        require: true,
        expires: '1h'
    }
}, { timestamps: true });

