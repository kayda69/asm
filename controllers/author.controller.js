const Author = require('../models/author.model');
const Comic = require('../models/comic.model');
const multer = require ('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({
    storage: storage,
});

exports.listAuthor = async (req, res, next)=>{
    let dieu_kien_loc = null;
    if(typeof(req.query._id) != 'undefined'){
        dieu_kien_loc = { _id: req.query._id}
    }
    var list = await Author.find(dieu_kien_loc)
    res.send(list);
}

exports.addAuthor = async (req,res,next) => {
    upload.single('imageAuthor')(req, res, async function (err) {
        // Các xử lý lỗi như ở ví dụ trước

        //Kiểm tra xem có file nào được upload hay không
        if (!req.file) {
            return res.status(400).send('Vui lòng chọn ảnh');
        }

        const fullName = req.body.fullName;
        const birthday = req.body.birthday;
        const nationality = req.body.nationality;
        const biography = req.body.biography;
        const image = 'uploads/' + req.file.filename;

        await Author.create({
            fullName: fullName,
            birthday: birthday,
            nationality: nationality,
            biography: biography,
            image: image, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
        });
        res.redirect('/Author');
    });
}

exports.updateAuthor = async (req,res,next) => {
    upload.single('imageAuthor')(req, res, async function (err) {
        // Các xử lý lỗi như ở ví dụ trước
        const data = await Author.find()
        let image = '';
        // Kiểm tra xem có file nào được upload hay không
        if (!req.file) {
            image = data.image;
        }else
        {
            image = 'uploads/' + req.file.filename;
        }
        const _id = req.body._id;
        const fullName = req.body.fullName;
        const birthday = req.body.birthday;
        const nationality = req.body.nationality;
        const biography = req.body.biography;
        // const image = 'uploads/' + req.file.filename;

        await Author.updateOne({_id : _id},{
            fullName: fullName,
            birthday: birthday,
            nationality: nationality,
            biography: biography,
            image: image,
        })
        res.redirect('/Author');
    });
}

exports.deleteAuthor = async function (req,res){

    const dataComic = await Comic.find();
    const _id = req.query._id

    const comicOfAuthor = dataComic.filter(com => com.author.equals(_id));
    const comicIDsToDelete = comicOfAuthor.map(comic => comic.author);
    if (comicIDsToDelete.length > 0) {
        const deletedComic = await Comic.deleteMany({ author: { $in: comicIDsToDelete } });
        console.log(deletedComic);
    }
    
    await Author.deleteOne({_id:_id})
    // Cap nhat lai danh sach sau khi xoa
    const data = await Author.find()
    res.redirect('/Author');
    res.render('Author', { title: 'PolyLib', data : data, path: '/uploads/' });
}