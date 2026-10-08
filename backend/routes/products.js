const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products (with search, category filter, sorting)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, available } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (available !== undefined && available !== '') {
      query.available = available === 'true';
    }

    let sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'name-asc') sortOptions.name = 1;
    else if (sort === 'name-desc') sortOptions.name = -1;
    else sortOptions.createdAt = -1;

    const products = await Product.find(query).sort(sortOptions);
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      count: products.length,
      categories,
      products
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
});

// @route   POST /api/products
// @desc    Add new product (Admin)
// @access  Private (Admin)
router.post('/', protectAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, category, image, quantity, available } = req.body;

    let imageUrl = image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80';
    }

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category: category || 'General',
      image: imageUrl,
      quantity: quantity !== undefined ? Number(quantity) : 10,
      available: available !== undefined ? (available === 'true' || available === true) : true
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ success: false, message: error.message || 'Error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin)
// @access  Private (Admin)
router.put('/:id', protectAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, category, image, quantity, available } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (available !== undefined) product.available = (available === 'true' || available === true);

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      product.image = image;
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin)
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

module.exports = router;
