import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { products as allProducts } from "../data/products";

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!search) return allProducts;

    return allProducts.filter((p) => {
      const hay = `${p.title} ${p.brand} ${p.description || ""}`.toLowerCase();
      return hay.includes(search);
    });
  }, [search]);

  return (
    <div>
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
