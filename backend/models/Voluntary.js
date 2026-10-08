const mongoose = require('mongoose');

const voluntarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    initiative: {
      type: String,
      required: [true, 'Initiative selection is required'],
      trim: true
    },
    availability: {
      type: String,
      default: 'Weekends'
    },
    message: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Voluntary', voluntarySchema);
