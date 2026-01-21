import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useStore } from "../store/storeProvider";
import { ACTIONS } from "../store/store";
import { useToast } from "../store/toastProvider";

import Loader from "../components/common/Loader";
import { fetchProductById } from "../api/products.api";

export default function ProductDetail() {
  const { dispatch, state } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setNotFound(false);

        const p = await fetchProductById(id);

        if (!alive) return;
        setProduct(p);
      } catch (err) {
        if (!alive) return;

        // If backend returns 404 -> treat as notFound
        const msg = err?.message || "Failed to load product";

        if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
          setNotFound(true);
          setProduct(null);
          return;
        }

        showToast(msg, { type: "danger" });
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, showToast]);

  if (loading) return <Loader label="Loading product details..." />;

  if (notFound || !product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          <h4 className="mb-2">Product not found</h4>
          <p className="mb-3">
            The product you're looking for doesn't exist or was removed.
          </p>
          <button className="btn btn-dark" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const wished = state.wishlist.ids.includes(product._id);

  const {
    title,
    brand,
    description,
    price,
    originalPrice,
    discountPercent,
    rating,
    ratingCount,
    images,
    sizes,
    inStock,
    stockQty,
    categoryId,
  } = product;

  const mainImg = images?.[0];

  return (
    <div className="container py-4">
      {/* Back link */}
      <div className="mb-4">
        <Link to="/products" className="text-decoration-none">
          ← Back to Products
        </Link>
      </div>

      <div className="row g-4">
        {/* Images */}
        <div className="col-12 col-lg-5">
          <div className="border rounded overflow-hidden bg-light">
            {mainImg ? (
              <img
                src={mainImg}
                alt={title}
                className="w-100"
                style={{ height: 420, objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: 420 }}
              >
                <span className="text-muted">No image</span>
              </div>
            )}
          </div>

          {images?.length > 1 ? (
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {images.slice(0, 4).map((src, idx) => (
                <img
                  key={src + idx}
                  src={src}
                  alt={`${title} ${idx + 1}`}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="col-12 col-lg-7">
          <h2 className="mb-1">{title}</h2>
          <p className="text-muted mb-2">{brand}</p>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-dark">⭐ {rating}</span>
            <small className="text-muted">({ratingCount} ratings)</small>

            {/* for now categoryId is an ObjectId. later we’ll populate category name from backend */}
            <small className="text-muted">• {product.category?.name}</small>
          </div>

          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-4 fw-bold">₹{price}</span>
            {originalPrice ? (
              <span className="text-muted text-decoration-line-through">
                ₹{originalPrice}
              </span>
            ) : null}
            {discountPercent ? (
              <span className="badge bg-success">{discountPercent}% OFF</span>
            ) : null}
          </div>

          <p className="mb-3">{description}</p>

          <div className="mb-3">
            {inStock ? (
              <span className="badge bg-success">
                In Stock {stockQty ? `(${stockQty} left)` : ""}
              </span>
            ) : (
              <span className="badge bg-danger">Out of Stock</span>
            )}
          </div>

          {Array.isArray(sizes) && sizes.length > 0 ? (
            <div className="mb-3">
              <h6 className="text-muted text-uppercase">Sizes</h6>
              <div className="d-flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <span key={s} className="badge bg-light text-dark border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-dark"
              disabled={!inStock}
              onClick={() => {
                dispatch({ type: ACTIONS.CART_ADD, payload: product._id });
                showToast("Added to cart ✅", { type: "success" });
              }}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => {
                dispatch({
                  type: ACTIONS.WISHLIST_TOGGLE,
                  payload: product._id,
                });
                showToast(
                  wished ? "Removed from wishlist" : "Added to wishlist ❤️",
                  { type: wished ? "warning" : "info" },
                );
              }}
            >
              {wished ? "Remove from Wishlist" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
