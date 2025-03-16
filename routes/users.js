const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.js');
const User = require('../models/users.js');  // Import the User model

// Get all users
router.get('/', async (request, response) => {
    try {
        const users = await User.find();
        response.json({ users });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Register a new user
router.post('/register', async (request, response) => {
    try {
        const { email, first_name, last_name, password } = request.body;

        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json("The email address is already taken.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            email,
            first_name,
            last_name,
            password: hashedPassword
        });

        await user.save();
        response.status(201).json('Successful registration');
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// User login
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json("User doesn't exist");
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return response.status(401).json("Invalid password");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_TOKEN,
            { expiresIn: '1h' }
        );

        response.json({ message: "Logged in successfully", token });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// Check if the token is valid
router.post('/valid-token', authMiddleware, (request, response) => {
    try {
        response.json("Valid token");
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;
