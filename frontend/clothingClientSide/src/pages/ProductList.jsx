import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/product/FilterSidebar";
import { products as allProducts } from "../data/products";

// Sample categories data (ye backend se aayega eventually)
const categories = [
  { _id: "cat-men", name: "Men" },
  { _id: "cat-women", name: "Women" },
  { _id: "cat-kids", name: "Kids" },
  { _id: "cat-footwear", name: "Footwear" },
  { _id: "cat-accessories", name: "Accessories" },
];

// ProductList component with filtering logic
export default function ProductList() {
  const [searchParams] = useSearchParams(); // to read query params from URL like ?search=shirt
  const search = (searchParams.get("search") || "").trim().toLowerCase();

  const [filters, setFilters] = useState({
    // initial filter state
    categoryIds: new Set(), // Set to store selected category IDs
    minRating: 0,
    sort: null, // "LOW_TO_HIGH" | "HIGH_TO_LOW" | null
  });

  function toggleCategory(catId) {
    // to toggle category selection in filters state
    setFilters((prev) => {
      const nextSet = new Set(prev.categoryIds); // create a new Set kyun ki set is mutable object if we edit react state may not detect changes.
      if (nextSet.has(catId)) nextSet.delete(catId);
      //agar present hai to hata do (untick) wrna add kar do (tick)
      else nextSet.add(catId); // not present
      return { ...prev, categoryIds: nextSet }; // return new state object with updated categoryIds Set
    });
  }

  function changeRating(value) {
    // to change minRating in filters state
    setFilters((prev) => ({ ...prev, minRating: value })); // return new state object with updated minRating
  }

  function changeSort(value) {
    // to change sort order in filters state
    setFilters((prev) => ({ ...prev, sort: value })); // return new state object with updated sort
  }

  function clearFilters() {
    // to reset all filters to initial state
    setFilters({ categoryIds: new Set(), minRating: 0, sort: null }); // reset to initial state
  }

  const filtered = useMemo(() => {
    // compute filtered products based on search and filters
    let result = allProducts; // start with all products

    // 1) Search
    if (search) {
      result = result.filter((p) => {
        // filter products based on search query
        const hay = `${p.title} ${p.brand} ${
          p.description || ""
        }`.toLowerCase();
        return hay.includes(search);
      });
    }

    // 2) Category
    if (filters.categoryIds.size > 0) {
      result = result.filter((p) => filters.categoryIds.has(p.categoryId));
    }

    // 3) Rating
    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    // 4) Sort by Price
    if (filters.sort === "LOW_TO_HIGH") {
      // sort in ascending order
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0)); // create new array before sort to avoid mutating original
    } else if (filters.sort === "HIGH_TO_LOW") {
      // sort in descending order
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0)); // create new array before sort to avoid mutating original
    }

    return result; // return the final filtered array
  }, [search, filters]);

  return (
    <div className="row g-3">
      {/* Sidebar */}
      <aside className="col-12 col-lg-3">
        <FilterSidebar
          categories={categories}
          filters={filters}
          onToggleCategory={toggleCategory}
          onChangeRating={changeRating}
          onChangeSort={changeSort}
          onClear={clearFilters}
        />
      </aside>

      {/* Main */}
      <section className="col-12 col-lg-9">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
          <div>
            <h2 className="mb-1">Products</h2>
            <p className="text-muted mb-0">
              {search ? (
                <>
                  Showing results for{" "}
                  <span className="fw-semibold">“{search}”</span>
                </>
              ) : (
                "Browse the latest picks."
              )}
            </p>
          </div>

          <span className="badge bg-light text-dark border">
            {filtered.length} items
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="alert alert-warning">
            No products found. Try a different search.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
