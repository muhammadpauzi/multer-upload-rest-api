const multer = require('multer');
const { extname } = require('path');

const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // the path is relative from server.js
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        // cek method file
        // console.log(file.fieldname)
        cb(null, uniquePrefix + extname(file.originalname));
    }
});

const uploadFile = multer({
    storage,
    limits: {
        fileSize: maxSize
    }
}).single('file');

module.exports = uploadFile;