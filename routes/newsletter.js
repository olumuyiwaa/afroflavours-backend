// routes/newsletter.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Newsletter subscription validation
const newsletterValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').optional().trim()
];

// Subscribe to newsletter
router.post('/subscribe', newsletterValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, name } = req.body;

        // Check if already subscribed (pseudo-code)
        // const existing = await Newsletter.findOne({ email });
        // if (existing) return res.status(409).json({ success: false, message: 'Email already subscribed' });

        // Save to database
        // await Newsletter.create({ email, name, subscribedAt: new Date() });

        // Send welcome email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to Afroflavours Newsletter!',
            html: `
        <h2>Welcome to Afroflavours!</h2>
        <p>Dear ${name || 'Friend'},</p>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You'll now receive updates about:</p>
        <ul>
          <li>Special promotions and discounts</li>
          <li>New menu items and African Dish of the Week</li>
          <li>Upcoming events and African Experience nights</li>
          <li>Behind-the-scenes stories and recipes</li>
        </ul>
        <p>We're excited to share the Afroflavours experience with you!</p>
        <p>Best regards,<br>The Afroflavours Team</p>
        <p style="font-size: 12px; color: #666;">
          Don't want to receive these emails? <a href="${process.env.BASE_URL}/unsubscribe?email=${email}">Unsubscribe</a>
        </p>
      `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe' });
    }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Remove from database
        // await Newsletter.deleteOne({ email });

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
    }
});

module.exports = router;