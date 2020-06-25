const express = require("express");
const app = express();
const { getImages } = require("./sql/db.js");

app.use(express.static("public"));

/* let cities = [
    { name: "Berlin", country: "Germany" },
    { name: "Quito", country: "Ecuador" },
    { name: "Tel Aviv", country: "Israel" },
]; */

app.get("/images", (req, res) => {
    getImages().then((result) => {
        res.json(result.rows);
        console.log("result.rows: ", result.rows);
    });
});

app.listen(8080, () => console.log("Imageboard server is listening"));
