const Comic = require('../models/comic.model');
const multer = require ('multer')
const Comment = require('../models/comment.model');
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

exports.listComic = async (req, res, next)=>{

    let dieu_kien_loc = null;
    if(typeof(req.query._id) != 'undefined'){
        dieu_kien_loc = { _id: req.query._id}
    }
    var list = await Comic.find(dieu_kien_loc).populate('author','fullName birthday nationality image biography');
    res.send(list);
}

exports.addComic = async (req, res, next) => {
    upload.fields([
        { name: 'coverImage', maxCount: 1 }, // Một tệp ảnh bìa
        { name: 'contentImage', maxCount: 15 } // Tối đa 15 tệp ảnh nội dung
    ])(req, res, async function (err) {
        // Các xử lý lỗi như trước


        if (!req.files['coverImage']) {
            return res.status(400).send('Vui lòng chọn ảnh bìa');
        }
        // Kiểm tra xem trường contentImage có tồn tại trong req.files hay không
        if (!req.files['contentImage'] || !req.files['contentImage'].length) {
            return res.status(400).send('Vui lòng chọn ít nhất một ảnh nội dung');
        }



        const name = req.body.name;
        const author = req.body.author;
        const publicationYear = req.body.publicationYear;
        const description = req.body.description;
        const coverImage = 'uploads/' + req.files['coverImage'][0].filename; // Ảnh bìa
        const contentImages = req.files['contentImage'].map(file => 'uploads/' + file.filename); // Mảng ảnh nội dung

        await Comic.create({
            name: name,
            author: author,
            publicationYear: publicationYear,
            description: description,
            coverImage: coverImage,
            contentImage: contentImages // Thêm mảng đường dẫn ảnh nội dung
        });
        sock.io.emit("new msg", "Có sách được thêm mới!");
        res.redirect('/comic');
    });
}

exports.addComicInApp = async (req, res, next) => {
    upload.fields([
        { name: 'coverImage', maxCount: 1 }, // Một tệp ảnh bìa
        { name: 'contentImage', maxCount: 15 } // Tối đa 15 tệp ảnh nội dung
    ])(req, res, async function (err) {

        const name = req.body.name;
        const author = req.body.author;
        const publicationYear = req.body.publicationYear;
        const description = req.body.description;
        const coverImage = 'uploads/' + req.files['coverImage'][0].filename; // Ảnh bìa
        //const coverImage = req.body.coverImage

        const contentImages = req.files['contentImage'].map(file => 'uploads/' + file.filename); // Mảng ảnh nội dung
        // const contentImages = req.body.contentImage
    
        try {
            const newComic = await Comic.create({
                name: name,
                author: author,
                publicationYear: publicationYear,
                description: description,
                coverImage: coverImage,
                contentImage: contentImages
            });
            res.status(201).json({ message: 'Thêm truyen tranh thành công', newItem: newComic });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    });
}

exports.updateComic = async (req, res, next) => {
    upload.fields([
        { name: 'coverImage', maxCount: 1 }, // Một tệp ảnh bìa
        { name: 'contentImage', maxCount: 15 } // Tối đa 15 tệp ảnh nội dung
    ])(req, res, async function (err) {
        // Các xử lý lỗi như trước
        const data = await Comic.find();
        let contentImages = '';
        let coverImages = '';
        // Kiểm tra xem có file nào được tải lên hay không

        if (!req.files['coverImage']) {
            coverImages = data.coverImage
        }else{
            coverImages = 'uploads/' + req.files['coverImage'][0].filename; // Ảnh bìa
        }
        // Kiểm tra xem trường contentImage có tồn tại trong req.files hay không
        if (!req.files['contentImage'] || !req.files['contentImage'].length) {
            contentImages = data.contentImage
        }else{
            contentImages = req.files['contentImage'].map(file => 'uploads/' + file.filename); // Mảng ảnh nội dung
        }

        const _id = req.body._id
        const name = req.body.name;
        const author = req.body.author;
        const publicationYear = req.body.publicationYear;
        const description = req.body.description;
        

        await Comic.updateOne({_id : _id},{
            name: name,
            author: author,
            publicationYear: publicationYear,
            description: description,
            coverImage: coverImages,
            contentImage: contentImages // Thêm mảng đường dẫn ảnh nội dung
        });

        res.redirect('/comic');
    });
}

exports.updateComicInApp = async (req, res, next) => {
    upload.fields([
        { name: 'coverImage', maxCount: 1 }, // Một tệp ảnh bìa
        { name: 'contentImage', maxCount: 15 } // Tối đa 15 tệp ảnh nội dung
    ])(req, res, async function (err) {
        // Các xử lý lỗi như trước
        const data = await Comic.find();
        let contentImages = '';
        let coverImages = '';
        // Kiểm tra xem có file nào được tải lên hay không

        if (!req.files['coverImage']) {
            coverImages = data.coverImage
        }else{
            coverImages = 'uploads/' + req.files['coverImage'][0].filename; // Ảnh bìa
        }
        // Kiểm tra xem trường contentImage có tồn tại trong req.files hay không
        if (!req.files['contentImage'] || !req.files['contentImage'].length) {
            contentImages = data.contentImage
        }else{
            contentImages = req.files['contentImage'].map(file => 'uploads/' + file.filename); // Mảng ảnh nội dung
        }

        const _id = req.body._id
        const name = req.body.name;
        const author = req.body.author;
        const publicationYear = req.body.publicationYear;
        const description = req.body.description;
        

        

        try {
            const newComic = await Comic.updateOne({_id : _id},{
                name: name,
                author: author,
                publicationYear: publicationYear,
                description: description,
                coverImage: coverImages,
                contentImage: contentImages // Thêm mảng đường dẫn ảnh nội dung
            });
            res.status(201).json({ message: 'Cap nhat truyen tranh thành công', newItem: newComic });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }

    });
}

exports.deleteComic = async (req, res)=>{
        const dataComment = await Comment.find();
        const _id = req.query._id;
        const commentOfComic = dataComment.filter(com => com.comic.equals(_id));
        const comicIDsToDelete = commentOfComic.map(comment => comment.comic);
        if (comicIDsToDelete.length > 0) {
            const deletedComments = await Comment.deleteMany({ comic: { $in: comicIDsToDelete } });
            console.log(deletedComments);
        }
        
        await Comic.deleteOne({_id:_id})
        // if (!deletedItem) {
        //     return res.status(404).json({ message: 'Item not found' });
        // }
        // res.json({ message: 'Item deleted successfully', item: deletedItem });
        const data = await Comic.find()
        res.redirect('/comic');
        res.render('Comic', { title: 'PolyLib', data : data, path: '/uploads/' });
    
}

exports.deleteComicInApp = async (req, res)=>{
    const dataComment = await Comment.find();
    const _id = req.params._id;
    const commentOfComic = dataComment.filter(com => com.comic.equals(_id));
    const comicIDsToDelete = commentOfComic.map(comment => comment.comic);
    if (comicIDsToDelete.length > 0) {
        const deletedComments = await Comment.deleteMany({ comic: { $in: comicIDsToDelete } });
        console.log(deletedComments);
    }
    try {
        await Comic.deleteOne({_id:_id})
        res.status(201).json({ message: 'Xoa truyen tranh thành công'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
    

}

