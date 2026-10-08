const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Consultancy = require('../models/Consultancy');
const Seminar = require('../models/Seminar');
const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Voluntary = require('../models/Voluntary');
const { protectAdmin } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics overview
// @access  Private (Admin)
router.get('/stats', protectAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalConsultancy = await Consultancy.countDocuments();
    const totalSeminars = await Seminar.countDocuments();
    const totalWorkshops = await Workshop.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalVoluntary = await Voluntary.countDocuments();

    // Recent activity highlights
    const recentConsultancies = await Consultancy.find().sort({ createdAt: -1 }).limit(5);
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);
    const recentRegistrations = await Registration.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalConsultancy,
        totalSeminars,
        totalWorkshops,
        totalRegistrations,
        totalContacts,
        totalVoluntary
      },
      recent: {
        consultancies: recentConsultancies,
        contacts: recentContacts,
        registrations: recentRegistrations
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats' });
  }
});

module.exports = router;
