const mongoose = require('mongoose');

const layoutSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    small: [{
        type: String
    }],
    main: [{
        elementName: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            min: 0,
            required: true
        },
        y: {
            type: Number,
            min: 0,
            required: true
        },
        width: {
            type: Number,
            min: 0,
            required: true
        }
    }]
});

module.exports = mongoose.model('Layout', layoutSchema);