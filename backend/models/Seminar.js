const mongoose = require('mongoose');

const seminarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Seminar title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Seminar description is required']
    },
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    speaker: {
      type: String,
      required: [true, 'Speaker information is required']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Seminar', seminarSchema);
