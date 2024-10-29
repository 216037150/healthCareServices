require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors'); // Import CORS

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Adjust this to the origin of your frontend
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, ''))); // Serve static files

const User = require('./model/user'); // User model

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Registration route
app.post('/register', async (req, res) => {
  console.log("Received registration request:", req.body); // Log incoming request
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username already exists.");
      return res.json({ success: false, message: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.json({ success: false, message: "Registration failed." });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Login failed." });
    }
  } catch (error) {
    res.json({ success: false });
  }
});


// Fetch users route
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username'); // Fetch only usernames
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
