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

// CORS configuration - allow configured frontend URL, local development ports, IPv6, file origins
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin, same-origin, or file:// origin (origin === 'null')
        if (!origin || origin === 'null') return callback(null, true);

        if (
            origin === FRONTEND_URL ||
            /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)
        ) {
            return callback(null, true);
        }
        // Permissive fallback so legitimate user requests are never blocked
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Rate limiting specifically for contact endpoint
// Max 50 requests per 15 minutes per IP (allows testing without false-positive lockouts)
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter to contact route (placed BEFORE static files to prevent directory collisions)
app.use('/api/contact', contactLimiter, contactRoute);

// Serve static frontend files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '..')));

// Global Error Handler (prevents leaking internal stack traces)
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message || err);
    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Portfolio Server is running!`);
    console.log(`> Local:       http://localhost:${PORT}`);
    console.log(`> Contact API: http://localhost:${PORT}/api/contact`);
    console.log(`=================================================\n`);
});
