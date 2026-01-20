import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store/storeProvider";

// Separate search form component that resets when URL search param changes
function SearchForm({ initialQuery }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);

  function handleSubmit(e) {
    e.preventDefault();
    const query = q.trim();

    if (!query) {
      navigate("/products");
      return;
    }
    navigate(`/products?search=${encodeURIComponent(query)}`);
  }

  function clearSearch() {
    setQ("");
    navigate("/products");
  }

  return (
    <form className="d-flex gap-2" onSubmit={handleSubmit} role="search">
      <div className="position-relative flex-grow-1" style={{ maxWidth: 400 }}>
        <input
          className="form-control ps-4"
          type="search"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search"
        />
        <span
          className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          style={{ pointerEvents: "none" }}
        >
          🔍
        </span>
      </div>
      <button className="btn btn-dark" type="submit" title="Search">
        Search
      </button>
      {q && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={clearSearch}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { cartCount, wishlistCount } = useStore();

  // Get current search query from URL
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search") || "";

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          FitFinder
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
                <span className="me-1">🛍️</span> Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/wishlist" className="nav-link position-relative">
                <span className="me-1">❤️</span> Wishlist
                {wishlistCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1 badge-glow">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link position-relative">
                <span className="me-1">🛒</span> Cart
                {cartCount > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1 badge-glow">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className="nav-link">
                <span className="me-1">👤</span> Profile
              </NavLink>
            </li>
          </ul>

          {/* Key prop resets SearchForm when URL search changes */}
          <SearchForm key={searchQuery} initialQuery={searchQuery} />
        </div>
      </div>
    </nav>
  );
}
