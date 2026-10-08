const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
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
    workshopId: {
      type: String,
      required: false
    },
    seminarId: {
      type: String,
      required: false
    },
    eventTitle: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['workshop', 'seminar'],
      default: 'workshop'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Registration', registrationSchema);
