const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { master, slave } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("Movie Booking Backend Running");
});

// Signup (Write → Master)
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  master.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("User Registered");
    }
  );
});

// Login (Read → Slave)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  slave.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length > 0) res.send("Login Success");
      else res.status(401).send("Invalid Credentials");
    }
  );
});

// Book Ticket (Write → Master)
app.post('/book', (req, res) => {
  const { username, movie, seats } = req.body;
  master.query(
    "INSERT INTO bookings (username, movie, seats) VALUES (?, ?, ?)",
    [username, movie, seats],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Ticket Booked");
    }
  );
});

// Get Bookings (Read → Slave)
app.get('/bookings/:username', (req, res) => {
  slave.query(
    "SELECT * FROM bookings WHERE username=?",
    [req.params.username],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});