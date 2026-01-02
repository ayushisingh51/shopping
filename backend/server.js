console.log("🔥 SERVER.JS LOADED");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// 🔹 INIT APP  (⚠️ MUST COME FIRST)
const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// 🔹 ROUTES
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// 🔹 ENV CHECK
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET not defined in .env");
  process.exit(1);
}

// serve local images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// -------------------- ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// optional: direct delete route (OK to keep)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const Product = require("./models/product");
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// health check
app.get("/", (req, res) => {
  res.send("Shopping App Backend Running 🚀");
});

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("Mongo error:", err));

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
