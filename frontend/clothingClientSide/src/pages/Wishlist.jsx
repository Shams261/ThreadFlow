import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../store/storeProvider"; // import global store
import { ACTIONS } from "../store/store"; // import action types
import { useToast } from "../store/toastProvider"; // import useToast hook
import { fetchProductById } from "../api/products.api"; // import API function
import Loader from "../components/common/Loader";

export default function Wishlist() {
  // Wishlist page component
  const { state, dispatch } = useStore(); // get global state and dispatch from store provider dispatch is used to send actions to update the state
  const { showToast } = useToast(); // get showToast function from toast context

  const [loading, setLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  // Fetch products from API when wishlist IDs change
  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      if (state.wishlist.ids.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all products in parallel
        const products = await Promise.all(
          state.wishlist.ids.map(async (id) => {
            try {
              return await fetchProductById(id);
            } catch {
              return null; // If product not found, return null
            }
          }),
        );

        if (!alive) return;
        setWishlistProducts(products.filter(Boolean)); // Remove nulls
      } catch {
        if (!alive) return;
        showToast("Failed to load wishlist products", { type: "danger" });
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      alive = false;
    };
  }, [state.wishlist.ids, showToast]);

  if (loading) return <Loader label="Loading wishlist..." />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Wishlist</h2>
        <span className="badge bg-light text-dark border">
          {wishlistProducts.length} items
        </span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="alert alert-info">
          {" "}
          {/* if no items in wishlist */}
          Your wishlist is empty. {/* show message */}
          <Link to="/products" className="alert-link">
            Browse products {/* link to products page */}
          </Link>
          .
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
          {wishlistProducts.map((p) => (
            <div className="col" key={p._id}>
              <div className="card h-100 shadow-sm">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="card-img-top"
                    style={{ height: 220, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 220 }}
                  >
                    <span className="text-muted">No image</span>
                  </div>
                )}

                <div className="card-body">
                  <h6 className="card-title mb-1">{p.title}</h6>
                  <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                    {p.brand}
                  </p>

                  <div className="d-flex align-items-baseline gap-2">
                    <span className="fw-bold">₹{p.price}</span>
                    {p.originalPrice ? (
                      <span className="text-muted text-decoration-line-through">
                        ₹{p.originalPrice}
                      </span>
                    ) : null}
                    {p.discountPercent ? (
                      <span className="badge bg-success">
                        {p.discountPercent}% OFF
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 d-flex align-items-center justify-content-between">
                    <small className="text-muted">
                      ⭐ {p.rating} ({p.ratingCount})
                    </small>
                    {!p.inStock ? (
                      <span className="badge bg-danger">Out of stock</span>
                    ) : null}
                  </div>
                </div>

                <div className="card-footer bg-white border-0 pt-0">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-dark"
                      disabled={!p.inStock}
                      onClick={() => {
                        dispatch({
                          type: ACTIONS.MOVE_WISHLIST_TO_CART,
                          payload: p._id,
                        });
                        showToast("Moved to cart ✅", { type: "success" });
                      }}
                    >
                      Move to Cart
                    </button>

                    <button
                      className="btn btn-outline-dark"
                      onClick={() => {
                        dispatch({
                          type: ACTIONS.WISHLIST_TOGGLE,
                          payload: p._id,
                        });
                        showToast("Removed from wishlist", { type: "warning" });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
