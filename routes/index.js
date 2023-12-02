var express = require('express');
var router = express.Router();
const comic = require("../models/comic.model");
const author = require("../models/author.model");
const likeComic = require("../models/likeComic.model");
const user = require("../models/user.model");
const comment = require("../models/comment.model");

/* GET home page. */
router.get('/',async function(req, res, next) {
  const admin = req.session.admin; // Lấy thông tin người dùng từ session
  const dataAuthor = await author.find()
  const dataComic = await comic.find()
  const dataLikeComic = await likeComic.find()
  const dataUser = await user.find()
  const dataComment = await comment.find()


  if(admin){
    
    //console.log(admin)
    res.render('index', {
      dataAuthor:dataAuthor,
      dataComic:dataComic,
      dataLikeComic:dataLikeComic,
      dataUser:dataUser,
      dataComment:dataComment});
  }else{
    console.log('No librarian in session'); // Kiểm tra thông tin người dùng trong console
    res.redirect('/'); // Chưa đăng nhập, chuyển hướng về trang đăng nhập
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      console.error(err);
    }
    res.redirect('/'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
  });
});

// router.get('/notify', (req,res, next)=>{
//   sock.io.emit("new msg", "Noi dung thong bao");
//   res.end();
//   res.redirect('/'); 
//   })


module.exports = router;
