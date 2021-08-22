const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cek method file
        // console.log(file.fieldname)
        cb(null, uniquePrefix + path.extname(file.originalname));
    }
});

const uploadFile = multer({
    storage,
    limits: {
        fileSize: maxSize
    }
}).single('file');

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK'
    });
});
app.post('/upload', (req, res) => {
    uploadFile(req, res, (err) => {
        // errors handling
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: 'File size cannot be larger than 2MB!'
                });
            }
            if (err.code == "LIMIT_UNEXPECTED_FILE") {
                // if file not sended
                if (req.file === undefined) {
                    return res.status(400).json({ message: "Please upload a file!" })
                }
            }
            return res.status(500).json({
                message: 'Could not upload the file'
            });
        }

        return res.status(201).json({
            message: 'File uploded'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});