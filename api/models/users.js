const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/ 
    }, 
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);