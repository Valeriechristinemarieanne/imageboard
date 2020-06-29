  DROP TABLE IF EXISTS comments CASCADE;
 
 CREATE TABLE comments(
      id SERIAL PRIMARY KEY,
      comment VARCHAR(255),
      username VARCHAR(255),
      image_id INT  REFERENCES images(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );