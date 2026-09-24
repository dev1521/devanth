const nodemailer = require('nodemailer');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = async function handler(req, res) {
    // Enable CORS for serverless
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            message: 'Contact API endpoint is online and ready for POST submissions.'
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (parseErr) {
                // Keep body as is
            }
        }
        let { name, email, message } = body || {};

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

        if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
            console.error('Missing MAIL_USER or MAIL_PASSWORD environment variables.');
            return res.status(500).json({
                success: false,
                message: 'Server mail configuration is incomplete. Please set MAIL_USER and MAIL_PASSWORD in your environment.'
            });
        }

        const port = parseInt(process.env.MAIL_PORT || '465', 10);
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: port,
            secure: port === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `Portfolio Contact Form <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_TO || process.env.MAIL_USER,
            replyTo: email,
            subject: `Portfolio Contact Form — ${name}`,
            text: `New portfolio contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Mail sent to Devanth Saravanan.'
        });
    } catch (error) {
        console.error('Contact email error:', error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || "Mail hasn't been sent. Please try again."
        });
    }
};
