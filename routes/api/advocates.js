const express = require('express');
const { collections } = require('../../server/db'); // Ensure correct path to db.ts

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const advocates = await collections.advocates.find({}).toArray();
        return res.status(200).json({ success: true, data: advocates });
    } catch (error) {
        console.error('Error fetching advocates:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;