const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

/* GET WISHLIST */
router.get("/", auth, async (req, res) => {
  res.json({ items: req.user.wishlist || [] });
});

/* TOGGLE WISHLIST */
router.post("/toggle", auth, async (req, res) => {
  const { productId } = req.body;

  const index = req.user.wishlist.findIndex(
    (p) => p.toString() === productId
  );

  if (index >= 0) {
    req.user.wishlist.splice(index, 1);
  } else {
    req.user.wishlist.push(productId);
  }

  await req.user.save();
  res.json({ message: "Wishlist updated" });
});

module.exports = router;
