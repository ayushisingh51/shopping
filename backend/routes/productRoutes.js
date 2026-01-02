console.log("✅ productRoutes loaded");

const express = require("express");
const router = express.Router();
const Product = require("../models/product");

/**
 * ADD PRODUCT
 * Expects JSON body:
 * {
 *   name,
 *   price,
 *   description,
 *   category,
 *   image  // "/images/iphone15.jpg"
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      image: image || "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg", // fallback image
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Add product error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL PRODUCTS
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
// ADD REVIEW
router.post("/:id/review", async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const newReview = {
      user,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(newReview);

    // ⭐ Update average rating
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = total / product.reviews.length;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
