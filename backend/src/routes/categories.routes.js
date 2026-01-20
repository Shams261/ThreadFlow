const router = require("express").Router();
const { asyncWrap } = require("../middlewares/asyncWrap");
const {
  getAllCategories,
  getSingleCategory,
} = require("../controllers/categories.controller");

router.get("/", asyncWrap(getAllCategories));
router.get("/:categoryId", asyncWrap(getSingleCategory));

module.exports = router;
