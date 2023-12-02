const mongoose = require('mongoose');
//fa-limongoose.connect('mongodb+srv://cuongezs280667:cuongbom123@cluster0.l5rl33f.mongodb.net/ComicReadManager')
mongoose.connect('mongodb://127.0.0.1:27017/ComicReadManager')
        .catch((err)=>{
            console.log("Loi ket noi csdl");
            console.log(err);
        });
module.exports = {mongoose};