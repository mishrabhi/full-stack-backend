const express = require("express");
const Product = require("../Schema/product.model");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

//Get all products
router.get("/", async (_, res) => {
  try {
    const products = await Product.find();
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Create Product
router.post("/", authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const newProduct = new Product({
      name,
      price,
      description,
      createdBy: req.user.id,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Update product
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Delete product
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
