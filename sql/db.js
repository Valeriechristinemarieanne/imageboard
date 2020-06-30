const spicedPg = require("spiced-pg");
/* const bcrypt = require("./bcrypt"); */

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("../secrets");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
}

// IMAGES TABLE
exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    );
};

exports.getSelectedImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

// COMMENTS TABLE
exports.addComments = (comment, username, image_id) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, image_id]
    );
};

exports.getComments = (image_id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [image_id]);
};
