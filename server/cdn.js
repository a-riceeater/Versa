const express = require("express");
const path = require("path");
const middle = require("./middleware");
const multer = require('multer');
const fs = require("fs");

const app = express.Router();
const upload = multer({ dest: 'uploads/' });

app.post("/upload-file", middle.authenticateToken, upload.single("file"), (req, res) => {
    const uploadedFile = req.file;
    const targetDirectory = path.join(__dirname, '../cdn', res.id, uploadedFile.originalname);

    if (uploadedFile.size > 10 * 1024 * 1024) {
        fs.unlink(uploadedFile.path, (err) => {
            if (err) console.error(err);
        });

        return res.status(400).json({ uploaded: false, error: 'File size exceeds 10MB' });
    }

    fs.rename(uploadedFile.path, targetDirectory, (err) => {
        if (err) {
            console.error(err);
            res.send({ uploaded: false, error: "Failed to save file, try again later."})
        } else {
            res.send({ uploaded: true })
        }
    });

    /*
    <form id="upload-form" enctype="multipart/form-data">
        <input type="file" name="file" id="file-input">
        <button type="submit">Upload</button>
    </form>

    document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        document.body.addEventListener('drop', async (event) => {
            event.preventDefault();

            const file = event.dataTransfer.files[0];
            
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/cdn-api/upload-file', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        });

    const fileInput = document.getElementById('file-input');
            const file = fileInput.files[0];
            
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/cdn-api/upload-file', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
    */
})

module.exports = app;