require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const contactRoute = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
app.use(express.json());

// CORS configuration - allow configured frontend URL and local development ports
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. same-origin, curl, mobile)
        if (!origin) return callback(null, true);

        if (
            origin === FRONTEND_URL ||
            /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(new Error('Blocked by CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Serve static frontend files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..')));

// Rate limiting specifically for contact endpoint
// Max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter to contact route
app.use('/api/contact', contactLimiter, contactRoute);

// Global Error Handler (prevents leaking internal stack traces)
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message || err);
    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
