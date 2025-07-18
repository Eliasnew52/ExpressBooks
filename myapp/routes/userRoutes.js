const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation





// @desc  Create a new user
// @route POST /api/users/register
// @access Public
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Please include all required fields: username, password, email' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with that email already exists' });
        }

        // Generate a salt
        // The 'saltRounds' (e.g., 10) determines how much time is needed to calculate a single bcrypt hash.
        // Higher values are more secure but take longer. 10-12 is a common starting point.
        const salt = await bcrypt.genSalt(10); 

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword, // Store the hashed password
            email
        });

        const savedUser = await newUser.save();
        
        // In a real application, you might want to return only safe user data,
        // not the entire user object including the hashed password directly.

        res.status(201).json({ _id: savedUser._id, username: savedUser.username, email: savedUser.email }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @desc  User login
// @route POST /api/users/login
// access Public

router.post('/login', async (req, res) => {

    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please include all required fields: username, password' });
    }
    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user){
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) { // If the passwords do not match
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // If the credentials are valid, generate a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret', // Use an environment variable for the secret
            { expiresIn: '1h' } // Token expiration time
        );

        // Respond with the user data and token
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token // Send the token back to the client
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;