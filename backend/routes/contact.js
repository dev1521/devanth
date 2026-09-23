const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Helper to create or get transporter
function getTransporter() {
    const port = parseInt(process.env.MAIL_PORT || '465', 10);
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
}

// Helper for basic email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

router.post('/', async (req, res) => {
    try {
        let { name, email, message } = req.body;

        // 1. Validation and Sanitization
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: 'Name is required and must be valid.' });
        }
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ success: false, message: 'Email is required and must be valid.' });
        }
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, message: 'Message is required and must be valid.' });
        }

        name = name.trim().substring(0, 100);
        email = email.trim().substring(0, 150);
        message = message.trim().substring(0, 5000);

        if (name.length === 0 || email.length === 0 || message.length === 0) {
            return res.status(400).json({ success: false, message: 'Fields cannot be empty strings.' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address format.' });
        }

        // 2. Email Formatting
        const mailOptions = {
            from: `Portfolio Contact Form <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_TO || process.env.MAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact Form — ${name}`,
            text: `New portfolio contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        // 3. Send Email
        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);

        // 4. Return Success
        return res.status(200).json({
            success: true,
            message: "Mail sent to Devanth Saravanan."
        });

    } catch (error) {
        // 5. Handle Failure
        console.error("Email sending failed:", error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || "Mail hasn't been sent. Please try again."
        });
    }
});

module.exports = router;
