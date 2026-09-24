const nodemailer = require('nodemailer');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.handler = async function (event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Netlify Contact function is active.'
            })
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
        };
    }

    try {
        let body = {};
        try {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
        } catch (e) {
            body = {};
        }

        let { name, email, message } = body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Name is required.' })
            };
        }
        if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'A valid email address is required.' })
            };
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Message is required.' })
            };
        }

        name = name.trim().substring(0, 100);
        email = email.trim().substring(0, 150);
        message = message.trim().substring(0, 5000);

        const mailUser = process.env.MAIL_USER || 'devanth017@gmail.com';
        const mailPass = process.env.MAIL_PASSWORD || 'dvnqatznjeffmwsm';
        const mailPort = parseInt(process.env.MAIL_PORT || '465', 10);
        const mailHost = process.env.MAIL_HOST || 'smtp.gmail.com';

        const transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: mailPort === 465,
            auth: {
                user: mailUser,
                pass: mailPass
            }
        });

        await transporter.sendMail({
            from: `Portfolio Contact Form <${mailUser}>`,
            to: process.env.MAIL_TO || mailUser,
            replyTo: email,
            subject: `Portfolio Contact Form — ${name}`,
            text: `New portfolio contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Mail sent to Devanth Saravanan.'
            })
        };
    } catch (err) {
        console.error('Netlify function mail error:', err.message || err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: err.message || "Mail could not be sent. Please try again."
            })
        };
    }
};
