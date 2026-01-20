const Category = require("../models/Category");

async function listCategories() {
  return Category.find().sort({ name: 1 });
}

async function getCategoryById(categoryId) {
  return Category.findById(categoryId);
}

module.exports = { listCategories, getCategoryById };
