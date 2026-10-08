const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/workshops
// @desc    Get all workshops
// @access  Public
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: workshops.length,
      workshops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching workshops' });
  }
});

// @route   GET /api/workshops/:id
// @desc    Get single workshop
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }
    res.json({ success: true, workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching workshop' });
  }
});

// @route   POST /api/workshops
// @desc    Create workshop (Admin)
// @access  Private (Admin)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { title, description, date, duration, location, instructor, seats } = req.body;

    const workshop = new Workshop({
      title,
      description,
      date,
      duration,
      location,
      instructor,
      seats: Number(seats)
    });

    const savedWorkshop = await workshop.save();
    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      workshop: savedWorkshop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error creating workshop' });
  }
});

// @route   PUT /api/workshops/:id
// @desc    Update workshop (Admin)
// @access  Private (Admin)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { title, description, date, duration, location, instructor, seats } = req.body;

    let workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }

    if (title) workshop.title = title;
    if (description) workshop.description = description;
    if (date) workshop.date = date;
    if (duration) workshop.duration = duration;
    if (location) workshop.location = location;
    if (instructor) workshop.instructor = instructor;
    if (seats !== undefined) workshop.seats = Number(seats);

    const updatedWorkshop = await workshop.save();
    res.json({
      success: true,
      message: 'Workshop updated successfully',
      workshop: updatedWorkshop
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error updating workshop' });
  }
});

// @route   DELETE /api/workshops/:id
// @desc    Delete workshop (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found' });
    }
    res.json({ success: true, message: 'Workshop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting workshop' });
  }
});

module.exports = router;
