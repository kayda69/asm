const mongoose = require('mongoose');
const db = require('./db');
const userSchema = new mongoose.Schema({
    fullName: String, // Ho ten
    username: String, // Ten dang nhap app
    email: String, // Email
    password: String, // Mat khau
    phoneNumber : String, // So dien thoai
    address : String, // Dia chi
    image : String // Anh dai dien
});
const User = mongoose.model('User', userSchema,'User');
module.exports = User;
