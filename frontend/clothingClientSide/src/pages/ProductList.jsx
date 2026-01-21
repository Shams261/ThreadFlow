import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/product/FilterSidebar";
import { fetchProductsWithQuery } from "../api/products.api";
import { fetchCategories } from "../api/categories.api";
import Loader from "../components/common/Loader";
import { useToast } from "../store/toastProvider";

// ProductList component with filtering logic
export default function ProductList() {
  const [searchParams] = useSearchParams(); // to read query params from URL like ?search=shirt
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const categoryFromUrl = searchParams.get("category"); // read category from URL
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    // initial filter state
    categoryIds: categoryFromUrl ? new Set([categoryFromUrl]) : new Set(), // Set category from URL if exists
    minRating: 0,
    sort: null, // "LOW_TO_HIGH" | "HIGH_TO_LOW" | null
  });

  useEffect(() => {
    let alive = true;

    async function loadCategories() {
      try {
        const c = await fetchCategories();
        if (!alive) return;
        setCategories(c);
      } catch (err) {
        showToast(err.message || "Failed to load categories", {
          type: "danger",
        });
      }
    }

    loadCategories();
    return () => {
      alive = false;
    };
  }, [showToast]);

  // Update filters when URL category parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters((prev) => ({
        ...prev,
        categoryIds: new Set([categoryFromUrl]),
      }));
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const params = {
          search: search || undefined,
          minRating:
            filters.minRating > 0 ? String(filters.minRating) : undefined,
          sort: filters.sort || undefined,
          categoryIds:
            filters.categoryIds.size > 0
              ? Array.from(filters.categoryIds).join(",")
              : undefined,
        };

        // remove undefined keys so URLSearchParams stays clean
        Object.keys(params).forEach(
          (k) => params[k] === undefined && delete params[k],
        );

        const p = await fetchProductsWithQuery(params);
        if (!alive) return;
        setProducts(p);
      } catch (err) {
        showToast(err.message || "Failed to load products", { type: "danger" });
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      alive = false;
    };
  }, [search, filters, showToast]);

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

  if (loading) return <Loader label="Loading products..." />;
  return (
    <div className="container py-4">
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
              {products.length} items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="alert alert-warning">
              No products found. Try a different search.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
