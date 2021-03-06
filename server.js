const express = require('express');
const cors = require('cors');
const { readdir } = require('fs');
const { join } = require('path');
const { response, uploadFile } = require('./utils');
const { message: { MESSAGE_COULD_NOT_UPLOAD, MESSAGE_COULD_NOT_DOWNLOAD, MESSAGE_FILE_REQUIRED, MESSAGE_FILE_UPLOADED_SUCCESSFULLY, MESSAGE_LIMIT_FILE_SIZE, MESSAGE_SERVER_ERROR } } = require('./constants');

const app = express();
const PORT = process.env.PORT || 5000;
const BASEURL = 'http://localhost:5000';
const uploadDirectoryPath = join(__dirname, 'uploads');

app.use(cors());
app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'This is home page of multer-upload-rest-api',
        endpoints: {
            image: BASEURL + '/images/<file_name>',
            images: BASEURL + '/api/images',
            upload: BASEURL + '/api/images/upload',
            download: BASEURL + '/api/images/download/<file_name>',
        },
        creator: "Muhammad Pauzi",
        repository: "https://github.com/muhammadpauzi/multer-upload-rest-api"
    });
});

app.get('/api/images', (req, res) => {
    readdir(join(uploadDirectoryPath, 'images'), (err, files) => {
        if (err) {
            return response(res, 500, {
                message: MESSAGE_SERVER_ERROR,
            });
        }

        let fileInfos = [];
        files.map(file => {
            fileInfos = [...fileInfos, {
                name: file,
                url: BASEURL + '/images/' + file,
                downloadUrl: BASEURL + '/api/images/download/' + file
            }];
        });

        return response(res, 200, {
            totalImages: fileInfos.length,
            images: fileInfos
        });
    });
});

app.post('/api/images/upload', (req, res) => {
    uploadFile(req, res, (err) => {
        // errors handling
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return response(res, 400, {
                    message: MESSAGE_LIMIT_FILE_SIZE
                });
            }

            if (err.code == "FILE_TYPE_NOT_ALLOWED") {
                return response(res, 400, {
                    message: err.message
                });
            }

            return response(res, 500, {
                message: MESSAGE_COULD_NOT_UPLOAD
            });
        }

        // if file doesn't exists or doesn't sent
        if (req.file === undefined) {
            return response(res, 400, {
                message: MESSAGE_FILE_REQUIRED
            });
        }

        return response(res, 201, {
            message: MESSAGE_FILE_UPLOADED_SUCCESSFULLY
        });
    });
});

app.get('/api/images/download/:name', (req, res) => {
    const fileName = req.params.name;
    res.download(join(uploadDirectoryPath, 'images', fileName),/** fileName,*/(err) => {
        if (err) {
            return response(res, 500, {
                message: MESSAGE_COULD_NOT_DOWNLOAD
            });
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});