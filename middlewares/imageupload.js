require('dotenv').config();
const path = require("path");
const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/")
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname)
            done(null, path.basename(file.originalname, ext) + Date.now() + ext)
        },
    }),
})

module.exports = {upload};