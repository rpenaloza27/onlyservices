const multer = require('multer');
const imagesTypes = {
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png"
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/imgs');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + Date.now() + imagesTypes[file.mimetype]);
    }
});
const fileImgaeFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg  or png"), false);
    }
}


const saveImages = (imageParameter, single = false) => {
    var tinified = require("tinify");
    tinified.key = "pfQkmgfd5MH1yQGJjYN1vdRCNsYpMnGM";
    // Cloudinary Credentials, Its free
    var cloudinary = require('cloudinary');
    cloudinary.config({
        cloud_name: 'onlyservices',
        api_key: '889867664199168',
        api_secret: 'jCmfIiAC6CyzCnp4qzXZXNb4jV0'
    });
    const upload = multer({ storage: storage, fileFilter: fileImgaeFilter });
    return !single ? upload.array(imageParameter) : upload.single(imageParameter);
}



module.exports = {
    saveImages
}

