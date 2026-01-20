const {
  listProducts,
  getProductById,
} = require("../services/products.service");

function shapeProduct(p) {
  if (!p) return p;
  const obj = p.toObject ? p.toObject() : p;
  return {
    ...obj,
    category: obj.categoryId, // rename populated categoryId to category
    categoryId: obj.categoryId?._id || obj.categoryId, // keep raw id too
  };
}

async function getAllProducts(req, res) {
  const products = await listProducts(req.query);
  res.json({ data: { products: products.map(shapeProduct) } });
}

async function getSingleProduct(req, res) {
  const { productId } = req.params;
  const product = await getProductById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ data: { product: shapeProduct(product) } });
}

module.exports = { getAllProducts, getSingleProduct };
