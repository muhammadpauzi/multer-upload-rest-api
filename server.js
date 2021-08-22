const express = require('express');
const cors = require('cors');
const uploadFile = require('./utils/upload');

const app = express();
const PORT = process.env.PORT || 5000;

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

            // if file not sended / not exists
            if (err.code == "LIMIT_UNEXPECTED_FILE") {
                if (req.file === undefined) {
                    return res.status(400).json({ message: "Please upload a file!" })
                }
            }

            if (err.code == "FILE_TYPE_NOT_ALLOWED") {
                return res.status(400).json({
                    message: err.message // from custom error in utils/upload.js
                });
            }

            return res.status(500).json({
                message: 'Could not upload the file'
            });
        }

        return res.status(201).json({
            message: 'File uploaded'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});