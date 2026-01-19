import { httpGet } from "./http";

export async function fetchCategories() {
  const json = await httpGet("/api/categories");
  return json.data.categories;
}
