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
    // to toggle category selection
    setFilters((prev) => {
      const nextSet = new Set(prev.categoryIds);
      if (nextSet.has(catId)) nextSet.delete(catId);
      else nextSet.add(catId);
      return { ...prev, categoryIds: nextSet };
    });
  }

  function changeRating(value) {
    setFilters((prev) => ({ ...prev, minRating: value }));
  }

  function changeSort(value) {
    setFilters((prev) => ({ ...prev, sort: value }));
  }

  function clearFilters() {
    setFilters({ categoryIds: new Set(), minRating: 0, sort: null });
  }

  const filtered = useMemo(() => {
    let result = allProducts;

    // 1) Search
    if (search) {
      result = result.filter((p) => {
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

    // 4) Sort
    if (filters.sort === "LOW_TO_HIGH") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filters.sort === "HIGH_TO_LOW") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
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
