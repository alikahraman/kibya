const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'İsim gerekli'],
    }, email: {
        type: String, required: [true, 'Email gerekli'], unique: [true, 'Email eşsiz olmalı'],
    }, password: {
        type: String, required: [true, 'Şifre gerekli'],
    },
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)