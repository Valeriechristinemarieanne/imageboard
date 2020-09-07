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
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6`);
};

exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $3, $2, $4) RETURNING *, TO_CHAR (created_at, 'DD. Month YYYY at HH:MI') AS created_at`,
        [url, username, title, description]
    );
};

exports.getSelectedImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

exports.getMoreImages = (lastId) =>
    db
        .query(
            `SELECT *, (SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6`,
            [lastId]
        )
        .then(({ rows }) => rows);

// COMMENTS TABLE
exports.addComments = (comment, c_username, image_id) => {
    return db.query(
        `INSERT INTO comments (comment, c_username, image_id) VALUES ($1, $2, $3) RETURNING *, TO_CHAR(created_at, 'DD. Month YYYY at HH:MI') AS created_at`,
        [comment, c_username, image_id]
    );
};

exports.getComments = (image_id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [image_id]);
};
