const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  getAllProducts,
  getSingleProduct,
} = require("../controllers/products.controller");

router.get("/", asyncWrap(getAllProducts));
router.get("/:productId", asyncWrap(getSingleProduct));

module.exports = router;
