// routes/reviews.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');


// Review validation
const reviewValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().notEmpty().withMessage('Review title is required'),
    body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 20 }).withMessage('Comment must be at least 20 characters'),
    body('visitDate').optional().isISO8601().withMessage('Valid date required')
];

// Submit a review
router.post('/', reviewValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, rating, title, comment, visitDate } = req.body;

        // Save review to database (pseudo-code)
        const review = await Review.create({
          name,
          email,
          rating,
          title,
          comment,
          visitDate,
          status: 'pending',
          createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your review! It will be published after moderation.',
            reviewId: `REV${Date.now().toString().slice(-8)}`
        });

    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
});

// Get approved reviews
// Get all reviews (admin) with filtering
router.get('/', async (req, res) => {
    try {
        const { status } = req.query; // optional

        const query = {};
        if (status) query.status = status;

        const reviews = await Review.find(query).sort({ createdAt: -1 });

        res.json({ success: true, reviews });

    } catch (error) {
        console.error('Reviews fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
});


// Get review statistics
router.get('/stats', async (req, res) => {
    try {
        // Calculate from database in production
        const stats = {
            totalReviews: 48,
            averageRating: 4.7,
            ratingDistribution: {
                5: 35,
                4: 10,
                3: 2,
                2: 1,
                1: 0
            },
            categories: {
                food: 4.8,
                service: 4.7,
                ambience: 4.9,
                value: 4.5
            }
        };

        res.json({ success: true, stats });

    } catch (error) {
        console.error('Review stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch review statistics' });
    }
});

// Approve a review
router.put('/:id/approve', async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.id, {
            status: "approved",
            isPublished: true
        });

        res.json({ success: true, message: "Review approved" });
    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ success: false, message: 'Failed to approve review' });
    }
});

// Reject a review
router.put('/:id/reject', async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.id, {
            status: "rejected",
            isPublished: false
        });

        res.json({ success: true, message: "Review rejected" });
    } catch (error) {
        console.error('Reject error:', error);
        res.status(500).json({ success: false, message: 'Failed to reject review' });
    }
});


module.exports = router;