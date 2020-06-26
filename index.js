const express = require("express");
const app = express();
const { getImages, addImage } = require("./sql/db.js");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
console.log("s3Url: ", s3Url);

app.use(express.static("public"));

// FILE UPLOAD BOILERPLATE
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    getImages().then((result) => {
        res.json(result.rows);
        /* console.log("result.rows: ", result.rows); */
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // req.file is the file we've just uploaded
    /* console.log("file: ", req.file); */
    // req.body is the rest of the input fields
    /* console.log("input: ", req.body); */

    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;
    console.log("imageUrl: ", imageUrl);

    if (req.file) {
        console.log("I am adding an image to the db");

        addImage(
            imageUrl,
            req.body.title,
            req.body.description,
            req.body.username
        ).then((response) => {
            console.log("response: ", response.rows[0]);

            res.json(response.rows[0]);
        });
    } else {
        console.log("ERROR in POST");
    }
});

app.listen(8080, () => console.log("Imageboard server is listening"));
