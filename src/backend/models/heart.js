const mongoose = require('mongoose');

const heartSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    value: Number,
    date: Date
});