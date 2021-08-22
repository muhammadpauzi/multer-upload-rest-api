const express = require('express');
const cors = require('cors');
const { readdir } = require('fs');
const { join } = require('path');
const { response, uploadFile } = require('./utils');

const app = express();
const PORT = process.env.PORT || 5000;
const BASEURL = 'http://localhost:5000';

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK'
    });
});

app.get('/images', (req, res) => {
    const directoryPath = join(__dirname, 'uploads');
    readdir(directoryPath, (err, files) => {
        if (err) {
            return response(res, 500, {
                message: "Something went wrong",
            });
        }

        let fileInfos = [];
        files.map(file => {
            fileInfos = [...fileInfos, { name: file, url: join(BASEURL, 'uploads', file) }];
        });

        return response(res, 200, {
            files: fileInfos
        });
    });
});

app.post('/upload', (req, res) => {
    uploadFile(req, res, (err) => {
        // errors handling
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return response(res, 400, {
                    message: 'File size cannot be larger than 2MB!'
                });
            }

            if (err.code == "FILE_TYPE_NOT_ALLOWED") {
                return response(res, 400, {
                    message: err.message
                });
            }

            return response(res, 500, {
                message: 'Could not upload the file'
            });
        }

        // if file doesn't exists or doesn't sent
        if (req.file === undefined) {
            return response(res, 400, {
                message: "Please upload a file!"
            });
        }

        return response(res, 201, {
            message: 'The file uploaded successfully'
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});