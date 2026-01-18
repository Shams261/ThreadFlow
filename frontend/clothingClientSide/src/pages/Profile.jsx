import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { products as allProducts } from "../data/products";

function findProduct(id) {
  return allProducts.find((p) => p._id === id) || null;
}

export default function Profile() {
  const { state } = useStore();

  const orders = state.orders.list;

  const addressCount = state.addresses.list.length;

  const latestOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="mb-1">Shams Tabrez</h4>
            <p className="text-muted mb-3">
              shamsshoaib261@gmail.com • +91-XXXXXXXXXX
            </p>

            <div className="mb-2">
              <span className="badge bg-light text-dark border">
                Saved Addresses: {addressCount}
              </span>
            </div>

            <Link to="/checkout" className="btn btn-outline-dark w-100">
              Manage Addresses / Checkout
            </Link>

            <small className="text-muted d-block mt-2">
              (For this assignment, profile data is static.)
            </small>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Order History</h5>
              <span className="badge bg-light text-dark border">
                {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="alert alert-info mb-0">
                No orders yet.{" "}
                <Link to="/products" className="alert-link">
                  Shop now
                </Link>
                .
              </div>
            ) : (
              <div className="d-grid gap-2">
                {latestOrders.map((o) => (
                  <div key={o._id} className="border rounded p-3">
                    <div className="d-flex justify-content-between">
                      <div className="fw-semibold">Order: {o._id}</div>
                      <span className="badge bg-success">{o.status}</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </div>

                    <div className="mt-2 text-muted" style={{ fontSize: 14 }}>
                      Items: {o.items.reduce((s, it) => s + it.qty, 0)} • Total:
                      ₹{o.totals.total}
                    </div>

                    <div className="mt-2">
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        Delivered to: {o.address.name}, {o.address.city}
                      </div>

                      <ul className="mb-0 mt-2" style={{ fontSize: 13 }}>
                        {o.items.slice(0, 3).map((it) => {
                          const p = findProduct(it.productId);
                          return (
                            <li key={it.productId}>
                              {p ? p.title : it.productId} — Qty {it.qty}
                            </li>
                          );
                        })}
                        {o.items.length > 3 ? <li>…more</li> : null}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
