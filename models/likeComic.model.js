const mongoose = require('mongoose');
const db = require('./db');
const likeComicSchema = new mongoose.Schema({
    user:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'User'
    }, // User like
    comic:{
        type: db.mongoose.Schema.Types.ObjectId, ref: 'Comic'
    }, // Comic duoc like
});

const LikeComic = mongoose.model('LikeComic', likeComicSchema,'LikeComic');

module.exports = LikeComic;
