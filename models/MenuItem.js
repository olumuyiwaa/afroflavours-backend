// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // friendly numeric id
    name: { type: String, default: ''  },
    description: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' }, // URL to Cloudinary
    category: {
        type: String,
        enum: ['starters', 'mains', 'sides', 'desserts', 'nonAlcoholic', 'alcoholic'],
        required: true
    },
    isVegetarian: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isDishOfWeek: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);