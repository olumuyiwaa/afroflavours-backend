// models/CateringRequest.js
const mongoose = require('mongoose');

const cateringRequestSchema = new mongoose.Schema({
    quoteRef: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventType: {
        type: String,
        enum: ['corporate', 'wedding', 'birthday', 'festival', 'community', 'other'],
        required: true
    },
    guestCount: {
        type: Number,
        required: true,
        min: 10
    },
    venue: {
        type: String,
        required: true
    },
    menuPreferences: String,
    specialRequirements: String,
    budget: String,
    attachment: String,
    status: {
        type: String,
        enum: ['pending', 'quoted', 'accepted', 'declined'],
        default: 'pending'
    },
    quotedAmount: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('CateringRequest', cateringRequestSchema);
