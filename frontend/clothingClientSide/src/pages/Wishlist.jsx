import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider"; // import global store
import { ACTIONS } from "../store/store"; // import action types
import { products as allProducts } from "../data/products"; // import all products data

function findProduct(productId) {
  // this function helps to find product by ID
  return allProducts.find((p) => p._id === productId) || null;
}

export default function Wishlist() {
  // Wishlist page component
  const { state, dispatch } = useStore(); // get global state and dispatch from store provider dispatch is used to send actions to update the state

  const wishlistProducts = state.wishlist.ids.map(findProduct).filter(Boolean); // get products in wishlist by mapping IDs to product objects
  // filter(Boolean) removes any nulls in case a product ID is not found agar ksii product ID ka data nhi mila to null aa jata hai
  // use filter krke hata dete hain
  return (
    <div>
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
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.MOVE_WISHLIST_TO_CART, // action to move item from wishlist to cart
                          payload: p._id, // product ID as payload
                        })
                      }
                    >
                      Move to Cart
                    </button>

                    <button
                      className="btn btn-outline-dark"
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.WISHLIST_TOGGLE, // action to toggle wishlist item
                          payload: p._id, // product ID as payload
                        })
                      }
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
