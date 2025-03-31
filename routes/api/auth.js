const express = require('express');
const bcrypt = require('bcryptjs');
const { collections } = require('../../server/db'); // Ensure correct path to db.ts

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login request received:', { username, password }); // Log request body

        // Find user by username
        const user = await collections.users.findOne({ username });
        if (!user) {
            console.log('User not found:', username); // Log if user is not found
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username); // Log if password does not match
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // Authentication successful
        req.session.user = { id: user._id, username: user.username, role: user.role };
        console.log('Login successful for user:', username); // Log successful login
        return res.status(200).json({ success: true, message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Login error:', error); // Log any unexpected errors
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;