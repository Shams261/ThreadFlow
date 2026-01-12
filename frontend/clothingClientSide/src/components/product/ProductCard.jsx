import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const {
    _id,
    title,
    brand,
    price,
    originalPrice,
    discountPercent,
    rating,
    ratingCount,
    images,
    inStock,
  } = product;

  const img = images?.[0];
  //    means: if images undefined/null, app crash na kare.
  // If no image, we show “No image” placeholder. Why? Real data can be incomplete, UI must not die.

  return (
    <div className="col">
      <div
        className="card h-100 shadow-sm"
        role="button"
        onClick={() => navigate(`/products/${_id}`)}
      >
        {img ? (
          <img
            src={img}
            className="card-img-top"
            alt={title}
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
          <h6 className="card-title mb-1">{title}</h6>
          <p className="text-muted mb-2" style={{ fontSize: 14 }}>
            {brand}
          </p>

          <div className="d-flex align-items-baseline gap-2">
            <span className="fw-bold">₹{price}</span>
            {originalPrice ? (
              <span className="text-muted text-decoration-line-through">
                ₹{originalPrice}
              </span>
            ) : null}
            {discountPercent ? (
              <span className="badge bg-success">{discountPercent}% OFF</span>
            ) : null}
          </div>

          <div className="mt-2 d-flex align-items-center justify-content-between">
            <small className="text-muted">
              ⭐ {rating} ({ratingCount})
            </small>
            {!inStock ? (
              <span className="badge bg-danger">Out of stock</span>
            ) : null}
          </div>
        </div>

        <div className="card-footer bg-white border-0 pt-0">
          <div className="d-grid gap-2">
            <button
              className="btn btn-dark"
              type="button"
              disabled={!inStock}
              onClick={(e) => {
                e.stopPropagation(); // card click prevent kya kar rha hai  : e.stopPropagation() on buttons Buttons are inside a
                // clickable card. Without stopPropagation: you click “Add to Cart” card’s onClick triggers too
                // it navigates to detail page accidentally Prevent parent click event from firing.
                // TODO1: add to cart
              }}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-outline-dark"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // TODO2: add to wishlist
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
