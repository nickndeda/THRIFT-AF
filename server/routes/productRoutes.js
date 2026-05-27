const express = require('express')

const Product = require('../models/Product')

const router = express.Router()

// GET PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()

    res.json(products)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

// CREATE PRODUCT
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body)

    const savedProduct = await product.save()

    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router