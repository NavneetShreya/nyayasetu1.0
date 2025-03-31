require('dotenv').config(); // Ensure environment variables are loaded
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.SESSION_STORE_URI, // Ensure this is correctly set in .env
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
);

// Log session store configuration for debugging
console.log('Session store configured with MongoDB:', process.env.SESSION_STORE_URI);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB:', process.env.MONGODB_URI); // Log MongoDB URI
});
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err); // Log connection errors
});

// Routes
app.use('/api', require('./routes/api'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});