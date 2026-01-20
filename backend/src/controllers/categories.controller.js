const {
  listCategories,
  getCategoryById,
} = require("../services/categories.service");

async function getAllCategories(req, res) {
  const categories = await listCategories();
  res.json({ data: { categories } });
}

async function getSingleCategory(req, res) {
  const { categoryId } = req.params;
  const category = await getCategoryById(categoryId);

  if (!category) return res.status(404).json({ message: "Category not found" });

  res.json({ data: { category } });
}

module.exports = { getAllCategories, getSingleCategory };
