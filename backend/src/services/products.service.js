const Product = require("../models/Product");

function buildProductsQuery(query) {
  const mongoQuery = {};
  const { categoryId, categoryIds, search, minRating } = query;

  // ✅ Category filtering (multiple or single)
  if (categoryIds) {
    const ids = String(categoryIds)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length > 0) {
      mongoQuery.categoryId = { $in: ids };
    }
  } else if (categoryId) {
    mongoQuery.categoryId = categoryId;
  }

  // ✅ Search (title + brand + description) - case-insensitive
  if (search) {
    const q = String(search).trim();
    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
      mongoQuery.$or = [
        { title: { $regex: safe, $options: "i" } },
        { brand: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }
  }

  // ✅ Min rating
  const r = Number(minRating);
  if (!Number.isNaN(r) && r > 0) {
    mongoQuery.rating = { $gte: r };
  }

  return mongoQuery;
}

function buildSort(sort) {
  if (sort === "LOW_TO_HIGH") return { price: 1 };
  if (sort === "HIGH_TO_LOW") return { price: -1 };
  return { createdAt: -1 }; // default
}

async function listProducts(query = {}) {
  const mongoQuery = buildProductsQuery(query);
  const sortObj = buildSort(query.sort);

  return Product.find(mongoQuery)
    .populate("categoryId", "name slug")
    .sort(sortObj);
}

async function getProductById(productId) {
  return Product.findById(productId).populate("categoryId", "name slug");
}

module.exports = { listProducts, getProductById };
