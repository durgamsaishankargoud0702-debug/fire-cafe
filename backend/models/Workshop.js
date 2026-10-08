const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workshop title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Workshop description is required']
    },
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    duration: {
      type: String,
      required: [true, 'Duration is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    instructor: {
      type: String,
      required: [true, 'Instructor is required']
    },
    seats: {
      type: Number,
      required: [true, 'Seats count is required'],
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Workshop', workshopSchema);
