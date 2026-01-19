import { httpGet } from "./http";

export async function fetchProducts() {
  const json = await httpGet("/api/products");
  return json.data.products;
}

export async function fetchProductById(id) {
  const json = await httpGet(`/api/products/${id}`);
  return json.data.product;
}
export async function fetchProductsWithQuery(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const json = await httpGet(`/api/products${qs ? `?${qs}` : ""}`);
  return json.data.products;
}
