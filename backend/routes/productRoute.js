const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();


router.post("/", protect, upload.single("image"), createProduct)
router.get("/", protect, getProducts)
router.get("/:id", protect, getProduct)
router.get("/", protect, getProducts)
router.delete("/:id", protect, deleteProduct)
router.patch("/:id", protect, upload.single("image"), updateProduct)


module.exports = router;