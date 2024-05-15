const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb is a custom multer call back function, the first argument is for the error,
        // if there isn't any errors, we pass a null value.

        // the destination directory has to be created manually, make sure you create it before uploading any files.
        cb(null, "static/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-";
        const fileName = uniqueSuffix + file.originalname;

        cb(null, fileName);
    },
});

const fileFilterFn = (req, file, cb) => {
    let filetypes = /jpeg||png||jpg/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    // Pass a string to the first cb argument to indidcate that there is an error
    // this error will throw, so it should be handled inside the controller correctly
    cb("Error: File upload only supports the following filetypes - " + filetypes);
};

const fileUpload = multer({ storage: storage, fileFilter: fileFilterFn });

module.exports = { fileUpload };
