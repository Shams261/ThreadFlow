import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store/storeProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const { cartCount, wishlistCount } = useStore(); // get counts from global store taaki re-render ho on changes

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return navigate("/products");
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          StyloAI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/products" className="nav-link">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/wishlist" className="nav-link">
                Wishlist ({wishlistCount})
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">
                Cart ({cartCount})
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </li>
          </ul>

          <form className="d-flex" onSubmit={handleSubmit} role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search products…"
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn btn-outline-dark" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
