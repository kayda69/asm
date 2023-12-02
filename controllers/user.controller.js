const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const LikeComic = require('../models/likeComic.model');
const multer = require ('multer')
var sock = require('../socket_server');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Duong dan luu tru file
    },
    // Tu dong dat ten anh la thoi gian hien tai + 1 so random
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({
    storage: storage,
});

exports.listUser = async (req, res, next)=>{

    let dieu_kien_loc = null;
    if(typeof(req.query._id) != 'undefined'){
        dieu_kien_loc = { _id: req.query._id}
    }
    var list = await User.find(dieu_kien_loc)
    res.send(list);
}
exports.addUser = async (req,res,next) => {
    upload.single('image')(req, res, async function (err) {

        const { fullName, phoneNumber, address,username,password,email } = req.body;
        const image = 'uploads/' + req.file.filename;
        if (!fullName || !phoneNumber || !address || !username || !password || !email) {
            return res.status(400).json({ message: 'Thiếu thông tin người dùng' });
        }
        try {
            const newUser = await User.create({
                fullName: fullName,
                username: username,
                email: email,
                password: password,
                address: address,
                phoneNumber: phoneNumber,
                image: image // Lưu đường dẫn tạm thời của tệp tin đã tải lên
            });
            res.status(201).json({ message: 'Thêm người dùng thành công', newItem: newUser });
        
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });
}
exports.updateUser = async (req,res,next) => {
    upload.single('image')(req, res, async function (err) {
        try {
            const { _id,fullName, phoneNumber, address,username,password,email } = req.body;
        
            let image = req.file ? req.file.path : null;
    
            if (!fullName || !username || !email || !password || !phoneNumber || !address) {
                return res.status(400).json(req.body)
            }
            const updatedFields = {
                fullName: fullName,
                phoneNumber: phoneNumber,
                username: username,
                email: email,
                password: password,
                address: address,
                image:image
            };
            // Kiểm tra xem có tệp tin mới được gửi lên không
            // if (image) {
            //     updatedFields.image = image;
            // }
            const updatedItem = await User.findOneAndUpdate(
                { _id: _id },
                updatedFields,
                { new: true }
            );
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item updated successfully', item: updatedItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    })
}

exports.deleteUser = async (req, res) => {
    try {
        const dataComment = await Comment.find();
        const dataLikeComic = await LikeComic.find();
        const _id = req.params._id;
        // Lọc ra tất cả các comment của user có _id
        const commentOfUser = dataComment.filter(com => com.user.equals(_id));
        const likeComicOfUser = dataLikeComic.filter(like => like.user.equals(_id));

        // Lấy danh sách user ids cần xóa
        const userIDsToDeleteOfComment = commentOfUser.map(comment => comment.user);
        const userIDsToDeleteOfLikeComic = likeComicOfUser.map(like => like.user);

        if (userIDsToDeleteOfComment.length > 0) {
            const deletedComments = await Comment.deleteMany({ user: { $in: userIDsToDeleteOfComment } });
            console.log(deletedComments);
        }

        if (userIDsToDeleteOfLikeComic.length > 0) {
            const deletedLikeComic = await LikeComic.deleteMany({ user: { $in: userIDsToDeleteOfLikeComic } });
            console.log(deletedLikeComic);
        }
        // Xóa user
        const deletedItem = await User.deleteOne({ _id: _id });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        //console.log(dataComment);
        res.json({
            message: 'Item deleted successfully',
            item: deletedItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


exports.deleteUserOnWeb = async (req, res) => {
    
        const dataComment = await Comment.find();
        const dataLikeComic = await LikeComic.find();
        const _id = req.query._id;
        // Lọc ra tất cả các comment của user có _id
        const commentOfUser = dataComment.filter(com => com.user.equals(_id));
        const likeComicOfUser = dataLikeComic.filter(like => like.user.equals(_id));

        // Lấy danh sách user ids cần xóa
        const userIDsToDeleteOfComment = commentOfUser.map(comment => comment.user);
        const userIDsToDeleteOfLikeComic = likeComicOfUser.map(like => like.user);

        if (userIDsToDeleteOfComment.length > 0) {
            const deletedComments = await Comment.deleteMany({ user: { $in: userIDsToDeleteOfComment } });
            console.log(deletedComments);
        }

        if (userIDsToDeleteOfLikeComic.length > 0) {
            const deletedLikeComic = await LikeComic.deleteMany({ user: { $in: userIDsToDeleteOfLikeComic } });
            console.log(deletedLikeComic);
        }
        // Xóa user
        deletedItem = await User.deleteOne({ _id: _id });

        const data = await User.find()
        res.redirect('/user');
        res.render('User', { title: 'PolyLib', data : data, path: '/uploads/' });
}

