var express = require("express");
var router = express.Router();

const comic = require("../models/comic.model");
const author = require("../models/author.model");
const likeComic = require("../models/likeComic.model");
const comment = require("../models/comment.model");
const user = require("../models/user.model");



// nhúng con troller
var comicCtrl = require("../controllers/comic.controller");
var likeComicCtrl = require("../controllers/likeComic.controller");
var commentCtrl = require("../controllers/comment.controller");




// Comic
router.get("/list", comicCtrl.listComic);
router.post("/add-comic", comicCtrl.addComic);
router.post("/add-comic-in-app", comicCtrl.addComicInApp);
router.post("/update-comic", comicCtrl.updateComic);
router.post("/update-comic-in-app", comicCtrl.updateComicInApp);
router.get("/delete-comic", comicCtrl.deleteComic);
router.delete("/delete-comic-in-app/:_id", comicCtrl.deleteComicInApp);


// Like Comic
router.get("/list-likeComic", likeComicCtrl.listLikeComic);
router.post("/add-likeComic", likeComicCtrl.addLikeComic);
router.delete("/delete-likeComic/:_id", likeComicCtrl.deleteLikeComic);


// Comment
router.get("/list-comment", commentCtrl.listComment);
router.post("/add-comment", commentCtrl.addCommentInApp);
router.delete("/delete-comment/:_id", commentCtrl.deleteCommentInApp);




/* GET home page. */
router.get("/", async function (req, res, next) {
  const admin = req.session.admin; // Lấy thông tin người dùng từ session
  const dataAuthor = await author.find()
  const dataComic = await comic.find()
  const dataLikeComic = await likeComic.find()
  const dataUser = await user.find()
  const dataComment = await comment.find()


  if (admin) {
    
    //console.log(admin);
    res.render("comic", {
      dataAuthor:dataAuthor,
      dataComic:dataComic,
      dataLikeComic:dataLikeComic,
      dataUser:dataUser,
      dataComment:dataComment,
      admin:admin
    });
  } else {
    console.log("No librarian in session"); // Kiểm tra thông tin người dùng trong console
    res.redirect("/"); // Chưa đăng nhập, chuyển hướng về trang đăng nhập
  }
});

module.exports = router;
