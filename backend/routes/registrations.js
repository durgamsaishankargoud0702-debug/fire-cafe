const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Workshop = require('../models/Workshop');
const Seminar = require('../models/Seminar');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/registrations
// @desc    Get all registrations (Admin)
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching registrations' });
  }
});

// @route   POST /api/registrations
// @desc    Register for workshop or seminar (Public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, workshopId, seminarId, eventTitle, type } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    let title = eventTitle || 'Event Registration';

    // If workshopId passed, decrease available seats if positive
    if (workshopId) {
      const workshop = await Workshop.findById(workshopId);
      if (workshop) {
        title = workshop.title;
        if (workshop.seats > 0) {
          workshop.seats -= 1;
          await workshop.save();
        }
      }
    } else if (seminarId) {
      const seminar = await Seminar.findById(seminarId);
      if (seminar) {
        title = seminar.title;
      }
    }

    const registration = new Registration({
      name,
      email,
      phone,
      workshopId: workshopId || null,
      seminarId: seminarId || null,
      eventTitle: title,
      type: type || (workshopId ? 'workshop' : 'seminar')
    });

    const savedReg = await registration.save();
    res.status(201).json({
      success: true,
      message: `Successfully registered for "${title}"!`,
      registration: savedReg
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error registering for event' });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete registration (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting registration' });
  }
});

module.exports = router;
