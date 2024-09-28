const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');

const firmSchema = new mongoose.Schema({
    firmname: {
        type: String,
        required: [true, 'Firm name is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return v && v.trim().length > 0;
            },
            message: props => `${props.value} is not a valid firm name`
        }
    
    },
    area: {
        type: String,
        required: true,
    },
    category: {
        type: [{
            type: String,
            enum: ['veg', 'nonVeg']
        }]
    },
    region: {
        type: [{
            type: String,
            enum: ['south indian', 'north indian']
        }]
    },
    offer: {
        type: String,
    },
    image: {
        type: String
    },
    Vendor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    }],
    products:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
        }
    ] 
});

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;