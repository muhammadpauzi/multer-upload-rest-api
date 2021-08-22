const express = require('express');
const cors = require('cors');
const { response, uploadFile } = require('./utils');

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