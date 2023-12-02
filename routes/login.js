var express = require('express');
var router = express.Router();
const Admin = require('../models/admin.model.js')
const session = require('express-session'); // Thêm dòng này
const db = require('../models/db.js');
const MongoStore = require('connect-mongo'); // Thêm dòng này
router.use(session({
    secret: 'cuongbom2102', // Thay 'your-secret-key' bằng một chuỗi bí mật thực sự
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://cuongezs280667:cuongbom123@cluster0.l5rl33f.mongodb.net/ComicReadManager' }) // Sử dụng MongoStore để lưu session vào MongoDB
}));
/* GET users listing. */
router.get('/',async function(req, res, next) {
    const data = await Admin.find().lean(); // Chuyển đổi thành plain JavaScript object
    const jsonData = JSON.parse(JSON.stringify(data)); // Chuyển đổi sang chuỗi JSON
    res.render('login', { title: 'PolyLib', data: jsonData });
});

router.post('/login', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Kiểm tra thông tin đăng nhập ở đây
    const admin = await Admin.findOne({ username, password });

    if (admin) {
        // Lưu thông tin đăng nhập vào session
        req.session.admin = admin;

        // Chuyển hướng đến trang dashboard hoặc trang chính của ứng dụng
        res.redirect('/index');
    } else {
        res.render('login', { title: 'PolyLib', data: jsonData, error: 'Thông tin đăng nhập không đúng' });
    }
});
module.exports = router;
