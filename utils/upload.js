const multer = require('multer');
const path = require('path');

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // the path is relative from server.js
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        // cek method file
        // console.log(file.fieldname)
        cb(null, uniquePrefix + path.extname(file.originalname));
    }
});

const checkFileType = (file, cb) => {
    // allowed extension
    const fileTypes = /jpeg|jpg|gif|png/;
    // check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb({
            code: "FILE_TYPE_NOT_ALLOWED",
            message: "Only image files are allowed to be uploaded"
        });
    }
}

const uploadFile = multer({
    storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('file');

module.exports = uploadFile;