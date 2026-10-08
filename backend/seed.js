const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Seminar = require('./models/Seminar');
const Workshop = require('./models/Workshop');
const Consultancy = require('./models/Consultancy');
const Voluntary = require('./models/Voluntary');
const Contact = require('./models/Contact');

const seedData = async () => {
  try {
    // 1. Seed Admin User
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const admin = new Admin({
        name: 'G. Sindhura Reddy Gogulamudi',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created: admin@example.com / admin123');
    }

    // 2. Seed Products (Food Product Development Showcase)
    // Clear old generic tech products if seeded
    const techCheck = await Product.findOne({ category: 'Software' });
    if (techCheck) {
      await Product.deleteMany({});
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        {
          name: 'Multigrain High-Protein Biscuits',
          description: 'Nutritional biscuit formulation enriched with pulses, millets, and high-protein blend to combat malnourishment.',
          price: 0,
          category: 'High-Protein Foods',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        },
        {
          name: 'Nutrition-Rich Indian Flat Bread',
          description: 'Multigrain and millet-fortified flatbread (chapati/roti) mix designed for enhanced dietary fiber and protein uptake.',
          price: 0,
          category: 'Bakery Products',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        },
        {
          name: 'Instant Ragi Meal & Breakfast Mix',
          description: 'Pre-cooked, instantized finger millet meal mix featuring high calcium, dietary fiber, and low glycemic index.',
          price: 0,
          category: 'Millet-Based Foods',
          image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        },
        {
          name: 'Nutritional Fruit & Pulse Beverages',
          description: 'Bioactive nutritional beverages formulated from fruit juices, natural sweeteners, and plant-based protein isolates.',
          price: 0,
          category: 'Processed Foods',
          image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        },
        {
          name: 'Extruded Finger Millet Shells',
          description: 'Cereal-millet-pulse extruded snack shells enriched with protein and carotenoids, evaluated for expansion ratio and moisture sorption.',
          price: 0,
          category: 'Extruded Products',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        },
        {
          name: 'Solar Dried Organic Fruit Bars',
          description: 'Value-added fruit and vegetable bars processed using renewable solar drying technology with optimized pretreatment.',
          price: 0,
          category: 'Functional Foods',
          image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
          quantity: 100,
          available: true
        }
      ]);
      console.log('✅ Food Product Development items seeded');
    }

    // 3. Seed Seminars
    const semTechCheck = await Seminar.findOne({ speaker: { $regex: 'Evelyn Vance', $options: 'i' } });
    if (semTechCheck) {
      await Seminar.deleteMany({});
    }

    const seminarCount = await Seminar.countDocuments();
    if (seminarCount === 0) {
      await Seminar.insertMany([
        {
          title: 'Effect of Ultrasonication on Teff Millet Properties',
          description: 'Keynote presentation detailing non-thermal ultrasonication processing parameters and its impact on Teff grain functionality.',
          date: '2026-10-20',
          time: '10:00 AM - 01:00 PM IST',
          location: 'Main Auditorium, Malla Reddy University & Virtual Stream',
          speaker: 'G. Sindhura Reddy Gogulamudi (Food Technologist & Researcher)',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Gamma Irradiation Technologies in Grain Processing',
          description: 'Scientific session evaluating gamma irradiation treatment on microbial decontamination, shelf stability, and bioactive retention in millets.',
          date: '2026-11-12',
          time: '02:00 PM - 05:00 PM IST',
          location: 'Food Science Innovation Centre, Hyderabad',
          speaker: 'G. Sindhura Reddy Gogulamudi (R&D Consultant)',
          image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Addressal of Food & Nutritional Challenges via Functional Millets',
          description: 'Symposium talk exploring biofortification, millet-based interventions, and high-protein formulations to overcome malnourishment.',
          date: '2026-12-05',
          time: '11:00 AM - 03:00 PM IST',
          location: 'ICRISAT Campus Conference Hall',
          speaker: 'G. Sindhura Reddy Gogulamudi (Former ICRISAT Consultant)',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
        }
      ]);
      console.log('✅ Food Science Seminars seeded');
    }

    // 4. Seed Workshops
    const workTechCheck = await Workshop.findOne({ instructor: { $regex: 'Alex Rivera', $options: 'i' } });
    if (workTechCheck) {
      await Workshop.deleteMany({});
    }

    const workshopCount = await Workshop.countDocuments();
    if (workshopCount === 0) {
      await Workshop.insertMany([
        {
          title: 'Food Product Development: Concept to Evaluation',
          description: 'Hands-on practical workshop covering raw material selection, formulation design, benchtop trials, sensory panels, and shelf-life testing.',
          date: '2026-10-28',
          duration: 'Full Day (6 Hours)',
          location: 'R&D Pilot Plant & Analytics Lab',
          instructor: 'G. Sindhura Reddy Gogulamudi',
          seats: 25
        },
        {
          title: 'Food Quality & Safety Standards (FSSAI & ISO 22000)',
          description: 'Comprehensive training on implementing quality assurance systems, microbial analysis protocols, and food safety compliance.',
          date: '2026-11-15',
          duration: '2 Days Workshop',
          location: 'Technology Center Auditorium',
          instructor: 'G. Sindhura Reddy Gogulamudi',
          seats: 30
        },
        {
          title: 'Processing Technologies for Millets & Functional Foods',
          description: 'Practical exploration of extrusion, thermal processing, non-thermal pretreatments, and value addition for millet grains.',
          date: '2026-12-01',
          duration: '1 Day Intensive',
          location: 'Food Processing Laboratory',
          instructor: 'G. Sindhura Reddy Gogulamudi',
          seats: 20
        }
      ]);
      console.log('✅ Food Technology Workshops seeded');
    }

    // 5. Seed Initial Consultancies
    const consultancyCount = await Consultancy.countDocuments();
    if (consultancyCount === 0) {
      await Consultancy.insertMany([
        {
          name: 'Agri-Foods Processing Pvt Ltd',
          email: 'inquiry@agrifoods.org',
          phone: '+91 98765 43210',
          service: 'Food Product Development',
          message: 'Seeking technical consulting for formulating millet-based high-protein cookies and optimizing vacuum-frying parameters.',
          status: 'In Progress'
        },
        {
          name: 'NutriBio Solutions',
          email: 'contact@nutribio.com',
          phone: '+91 91234 56789',
          service: 'Food Plant Setup',
          message: 'Requesting guidance on machinery selection and process layout for setting up a groundnut processing facility.',
          status: 'Pending'
        }
      ]);
      console.log('✅ Default Consultancies seeded');
    }

    // 6. Seed Initial Contacts & Voluntary Signups
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.insertMany([
        {
          name: 'Dr. K. Sharma',
          email: 'ksharma@foodtechinst.org',
          phone: '+91 98111 22334',
          subject: 'Research Collaboration Enquiry',
          message: 'Would like to discuss a collaborative research proposal on Teff grain processing and value addition.'
        }
      ]);
      console.log('✅ Default Contacts seeded');
    }

    const volCount = await Voluntary.countDocuments();
    if (volCount === 0) {
      await Voluntary.insertMany([
        {
          name: 'Rajesh Verma',
          email: 'rajesh@communitynutrition.org',
          phone: '+91 99887 76655',
          initiative: 'Nutritional Baseline Survey (Giriposhana Project)',
          availability: 'Weekdays',
          message: 'Interested in participating in community nutrition field surveys and supplementary food distribution.'
        }
      ]);
      console.log('✅ Default Voluntary signups seeded');
    }

  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = seedData;

