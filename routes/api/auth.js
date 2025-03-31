const express = require('express');
const bcrypt = require('bcryptjs');
const { collections } = require('../../server/db'); // Ensure correct path to db.ts

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await collections.users.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect username or password' });
        }

        // Authentication successful
        req.session.user = { id: user._id, username: user.username, role: user.role };
        return res.status(200).json({ success: true, message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;