const multer = require('multer');
const path = require('path');
const { message: { MESSAGE_FILE_NOT_ALLOWED } } = require('../constants');

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images'); // the path is relative from server.js
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
            message: MESSAGE_FILE_NOT_ALLOWED
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