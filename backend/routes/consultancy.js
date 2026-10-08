const express = require('express');
const router = express.Router();
const Consultancy = require('../models/Consultancy');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/consultancy
// @desc    Get all consultancy requests (Admin)
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const requests = await Consultancy.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      consultancies: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching consultancy requests' });
  }
});

// @route   POST /api/consultancy
// @desc    Submit consultancy request (Public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const newRequest = new Consultancy({
      name,
      email,
      phone,
      service,
      message
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully! Our team will contact you shortly.',
      consultancy: savedRequest
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error submitting request' });
  }
});

// @route   PUT /api/consultancy/:id
// @desc    Update consultancy request status (Admin)
// @access  Private (Admin)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Consultancy.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (status) request.status = status;
    await request.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      consultancy: request
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating request status' });
  }
});

// @route   DELETE /api/consultancy/:id
// @desc    Delete consultancy request (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const request = await Consultancy.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, message: 'Consultancy request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting request' });
  }
});

module.exports = router;
