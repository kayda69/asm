var express = require("express");
var router = express.Router();

const author = require("../models/author.model");

// nhúng con troller
var authorCtrl = require("../controllers/author.controller");

router.get("/list", authorCtrl.listAuthor);
router.post("/addAuthor", authorCtrl.addAuthor);
router.get("/deleteAuthor", authorCtrl.deleteAuthor);
router.post("/updateAuthor", authorCtrl.updateAuthor);


/* GET home page. */
router.get("/",async function (req, res, next) {
  const admin = req.session.admin; // Lấy thông tin người dùng từ session
  const dataAuthor = await author.find()
  if (admin) {
    console.log(admin);
    res.render("author", {dataAuthor:dataAuthor});
  } else {
    console.log("No librarian in session"); // Kiểm tra thông tin người dùng trong console
    res.redirect("/"); // Chưa đăng nhập, chuyển hướng về trang đăng nhập
  }
});

module.exports = router;
