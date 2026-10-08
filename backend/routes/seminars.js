const express = require('express');
const router = express.Router();
const Seminar = require('../models/Seminar');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/seminars
// @desc    Get all seminars
// @access  Public
router.get('/', async (req, res) => {
  try {
    const seminars = await Seminar.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: seminars.length,
      seminars
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching seminars' });
  }
});

// @route   GET /api/seminars/:id
// @desc    Get single seminar
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) {
      return res.status(404).json({ success: false, message: 'Seminar not found' });
    }
    res.json({ success: true, seminar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching seminar' });
  }
});

// @route   POST /api/seminars
// @desc    Create seminar (Admin)
// @access  Private (Admin)
router.post('/', protectAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, date, time, location, speaker, image } = req.body;

    let imageUrl = image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
    }

    const seminar = new Seminar({
      title,
      description,
      date,
      time,
      location,
      speaker,
      image: imageUrl
    });

    const savedSeminar = await seminar.save();
    res.status(201).json({
      success: true,
      message: 'Seminar created successfully',
      seminar: savedSeminar
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error creating seminar' });
  }
});

// @route   PUT /api/seminars/:id
// @desc    Update seminar (Admin)
// @access  Private (Admin)
router.put('/:id', protectAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, date, time, location, speaker, image } = req.body;

    let seminar = await Seminar.findById(req.params.id);
    if (!seminar) {
      return res.status(404).json({ success: false, message: 'Seminar not found' });
    }

    if (title) seminar.title = title;
    if (description) seminar.description = description;
    if (date) seminar.date = date;
    if (time) seminar.time = time;
    if (location) seminar.location = location;
    if (speaker) seminar.speaker = speaker;

    if (req.file) {
      seminar.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      seminar.image = image;
    }

    const updatedSeminar = await seminar.save();
    res.json({
      success: true,
      message: 'Seminar updated successfully',
      seminar: updatedSeminar
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error updating seminar' });
  }
});

// @route   DELETE /api/seminars/:id
// @desc    Delete seminar (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const seminar = await Seminar.findByIdAndDelete(req.params.id);
    if (!seminar) {
      return res.status(404).json({ success: false, message: 'Seminar not found' });
    }
    res.json({ success: true, message: 'Seminar deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting seminar' });
  }
});

module.exports = router;
