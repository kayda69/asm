const mongoose = require('mongoose');
const db = require('./db');
const adminSchema = new mongoose.Schema({
    fullName: String, // Ho ten
    username : String, // Ten dang nhap
    password : String, // Mat khau
});

const Admin = mongoose.model('Admin', adminSchema,'Admin');
module.exports = Admin;
