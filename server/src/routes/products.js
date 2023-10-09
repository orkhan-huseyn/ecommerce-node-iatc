const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const multer = require("multer");
const { createMulterStorage } = require("../utils/createMulterStorage");

const upload = multer({
  storage: createMulterStorage("src/public/images/products"),
});

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", upload.array("images"), createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
