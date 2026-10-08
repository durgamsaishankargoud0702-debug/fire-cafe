const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/contact
// @desc    Get all contact messages (Admin)
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      contacts: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contact messages' });
  }
});

// @route   POST /api/contact
// @desc    Submit contact form message (Public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    const savedContact = await newContact.save();
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will reply soon!',
      contact: savedContact
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error submitting message' });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting message' });
  }
});

module.exports = router;
