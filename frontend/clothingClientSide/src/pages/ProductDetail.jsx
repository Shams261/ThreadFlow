import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products as allProducts } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams(); // get product ID from URL params
  const navigate = useNavigate(); // for navigation (e.g., go back)

  // Find the product by ID using useMemo for optimization

  const product = useMemo(() => {
    return allProducts.find((p) => p._id === id) || null;
  }, [id]);

  if (!product) {
    return (
      <div className="alert alert-warning">
        <h4 className="mb-2">Product not found</h4>
        <p className="mb-3">
          The product you’re looking for doesn’t exist or was removed.
        </p>
        <button className="btn btn-dark" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

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
    <div>
      {/* Simple back link to products list (Breadcrumb-ish) */}
      <div className="mb-3">
        <Link to="/products" className="text-decoration-none">
          ← Back to Products
        </Link>
      </div>

      <div className="row g-4">
        {/* Main image and thumbnails */}
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
          {/* Show if more than 1 image */}
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
        {/* Product details */}
        <div className="col-12 col-lg-7">
          <h2 className="mb-1">{title}</h2>
          <p className="text-muted mb-2">{brand}</p>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-dark">⭐ {rating}</span>
            <small className="text-muted">({ratingCount} ratings)</small>
            <small className="text-muted">• {categoryId}</small>
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
          {/* Stock status */}
          <div className="mb-3">
            {inStock ? (
              <span className="badge bg-success">
                In Stock {stockQty ? `(${stockQty} left)` : ""}
              </span>
            ) : (
              <span className="badge bg-danger">Out of Stock</span>
            )}
          </div>
          {/* Sizes only show if available */}
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
          {/* Actions buttons when in stock */}
          <div className="d-grid gap-2 d-sm-flex mt-4">
            <button
              className="btn btn-dark"
              disabled={!inStock}
              onClick={() => {
                // next step: dispatch add-to-cart
                alert("Added to cart (will wire real cart next)");
              }}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline-dark"
              onClick={() => {
                // next step: dispatch wishlist toggle
                alert("Added to wishlist (will wire real wishlist next)");
              }}
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
