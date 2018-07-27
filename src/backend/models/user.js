const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    birth: Date,
    gender: String,
});

module.exports = mongoose.model('User', userSchema);