const mongoose = require('mongoose');
const db = require('./db');
const comicSchema = new mongoose.Schema({
    name: String, // Ten sach
    author:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'Author'
    }, // Tac gia
    coverImage : String, // Anh bia
    contentImage : [{type : String}]     , // ANh noi dung
    publicationYear: String, // Nam xuat ban
    description:String // Chi tiet cua cuon sach
});

const Comic = mongoose.model('Comic', comicSchema,'Comic');

module.exports = Comic;
