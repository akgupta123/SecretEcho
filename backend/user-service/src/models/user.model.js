const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    username : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports.User = mongoose.model('User', userSchema);
