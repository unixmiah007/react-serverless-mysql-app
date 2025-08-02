import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected.");
});

// GET all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST new user
app.post("/users", (req, res) => {
  const { firstname, lastname, email, username } = req.body;
  db.query(
    "INSERT INTO users (firstname, lastname, email, username) VALUES (?, ?, ?, ?)",
    [firstname, lastname, email, username],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(201);
    }
  );
});

// ✅ DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(404).send("User not found.");
    res.sendStatus(204); // No Content
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
