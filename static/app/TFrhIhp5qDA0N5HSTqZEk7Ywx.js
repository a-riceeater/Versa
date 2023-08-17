/*
    Elijah Bantugan
    MIT License

    file-uploads.js
*/

document.body.addEventListener('dragover', (event) => {
    event.preventDefault();
});

document.body.addEventListener('drop', async (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    vt.log("File Uploader", "File dragged onto body, " + file.size + " file size")
    
    if (file.size > 10 * 1024 * 1024) { // 10 * 1024 * 1024 = 10mb
        const error = new ErrorModal();
        error.title = "Your file is too large!"
        error.body = "Maximum file size is 10 MB"

        error.spawn();

        return
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        vt.log("File Uploader", "Uploading file...")
        const response = await fetch('/cdn-api/upload-file', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        vt.log("File Uploader", "Response recieved from server...")

        if (data.uploaded) {
            const success = new ErrorModal();
            success.title = "File uploaded"
            success.body = "File uploaded sucessfully"

            success.spawn();
        } else {
            const error = new ErrorModal();
            error.title = "Failed to upload"
            error.body = data.error;

            error.spawn();
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
});