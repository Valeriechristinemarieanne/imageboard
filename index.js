const express = require("express");
const app = express();
const {
    getImages,
    addImage,
    getSelectedImage,
    getComments,
    addComments,
    getMoreImages,
} = require("./sql/db.js");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
console.log("s3Url: ", s3Url);

app.use(express.static("public"));
app.use(express.json());

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
    getImages()
        .then((result) => {
            res.json(result.rows);
            /* console.log("result.rows: ", result.rows); */
        })
        .catch(function (err) {
            console.log("err in GET/images:", err);
        });
});

app.get("/selectedimage/:id", (req, res) => {
    /* console.log("I am working", req.params.id); */
    getSelectedImage(req.params.id)
        .then((response) => {
            res.json(response.rows[0]);
            /* console.log("response: ", response); */
        })
        .catch(function (err) {
            console.log("error in GET /images/:id: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;

    if (req.file) {
        addImage(
            imageUrl,
            req.body.title,
            req.body.description,
            req.body.username
        ).then((response) => {
            res.json(response.rows[0]);
        });
    } else {
        console.log("ERROR in POST images");
    }
});

app.get("/comments/:id", (req, res) => {
    getComments(req.params.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch(function (err) {
            console.log("err in GET/comments:", err);
        });
});

app.post("/comments", (req, res) => {
    /* console.log("I want to add comments to the table");
    console.log("this is my req.body: ", req.body); */
    addComments(req.body.comment, req.body.c_username, req.body.image_id)
        .then((result) => {
            res.json(result.rows[0]);
            /* console.log("result.rows: ", result.rows); */
        })
        .catch(function (err) {
            console.log("err in POST/comments:", err);
        });
});

app.get("/moreimages/:id", (req, res) => {
    /*    console.log("I want more than 6 images");
    console.log("req.params.id: ", req.params.id); */

    getMoreImages(req.params.id)
        .then((result) => {
            /* console.log("result: ", result); */
            res.json(result);
        })
        .catch(function (err) {
            console.log("err in get/moreimages:", err);
        });
});

app.listen(8080, () => console.log("Imageboard server is listening"));
