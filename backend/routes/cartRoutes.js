const express = require("express");
const auth = require("../middlewares/auth");
const Product = require("../models/product");

const router = express.Router();

/* GET CART */
router.get("/", auth, async (req, res) => {
  res.json({ items: req.user.cart || [] });
});

/* ADD TO CART */
router.post("/add", auth, async (req, res) => {
  const { productId } = req.body;

  const existing = req.user.cart.find(
    (i) => i.product.toString() === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    req.user.cart.push({ product: productId, quantity: 1 });
  }

  await req.user.save();
  res.json({ message: "Added to cart" });
});

module.exports = router;
