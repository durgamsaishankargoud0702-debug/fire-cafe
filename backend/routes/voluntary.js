const express = require('express');
const router = express.Router();
const Voluntary = require('../models/Voluntary');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/voluntary
// @desc    Get all voluntary signups (Admin)
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const list = await Voluntary.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: list.length,
      volunteers: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching voluntary signups' });
  }
});

// @route   POST /api/voluntary
// @desc    Submit voluntary signup (Public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, initiative, availability, message } = req.body;

    if (!name || !email || !phone || !initiative) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and initiative choice are required'
      });
    }

    const volunteer = new Voluntary({
      name,
      email,
      phone,
      initiative,
      availability,
      message
    });

    const saved = await volunteer.save();
    res.status(201).json({
      success: true,
      message: 'Thank you for volunteering! Our community coordinator will connect with you.',
      volunteer: saved
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error submitting signup' });
  }
});

// @route   DELETE /api/voluntary/:id
// @desc    Delete volunteer signup (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const vol = await Voluntary.findByIdAndDelete(req.params.id);
    if (!vol) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found' });
    }
    res.json({ success: true, message: 'Volunteer record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting record' });
  }
});

module.exports = router;
