import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/storeProvider"; // import global store
import { ACTIONS } from "../../store/store"; // import action types
import { useToast } from "../../store/toastProvider"; // import useToast hook

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dispatch, state } = useStore(); // get dispatch and state from global store means re-render on state changes
  // matlab jab wishlist or cart change hoga toh yeh component bhi re-render hoga
  const { showToast } = useToast(); // get showToast function from toast context
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
  const wished = state.wishlist.ids.includes(_id); // check if product is in wishlist

  return (
    <div className="col">
      <div
        className="card h-100 shadow-sm product-card"
        role="button"
        onClick={() => navigate(`/products/${_id}`)}
      >
        <div className="position-relative">
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
          {discountPercent ? (
            <span className="badge bg-success position-absolute top-0 start-0 m-2">
              {discountPercent}% OFF
            </span>
          ) : null}
        </div>

        <div className="card-body px-2 px-sm-3">
          <h6 className="card-title mb-1 text-truncate" title={title}>
            {title}
          </h6>
          <p className="text-muted mb-2 small">{brand}</p>

          <div className="d-flex align-items-baseline gap-1 gap-sm-2 flex-wrap">
            <span className="fw-bold">₹{price}</span>
            {originalPrice ? (
              <span className="text-muted text-decoration-line-through small">
                ₹{originalPrice}
              </span>
            ) : null}
          </div>

          <div className="mt-2 d-flex align-items-center justify-content-between">
            <small className="text-muted">
              ⭐ {rating} ({ratingCount})
            </small>
            {!inStock ? (
              <span className="badge bg-danger small">Out of stock</span>
            ) : null}
          </div>
        </div>

        <div className="card-footer bg-white border-0 pt-0 px-2 px-sm-3 pb-2 pb-sm-3">
          <div className="d-grid gap-2">
            <button
              className="btn btn-dark btn-sm"
              type="button"
              disabled={!inStock}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.CART_ADD, payload: _id });
                showToast("Added to cart ✅", { type: "success" });
              }}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline-dark btn-sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.WISHLIST_TOGGLE, payload: _id });
                showToast(
                  wished ? "Removed from wishlist" : "Added to wishlist ❤️",
                  {
                    type: wished ? "warning" : "info",
                  },
                );
              }}
            >
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
