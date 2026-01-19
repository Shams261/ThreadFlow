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
      <input
        className="form-control"
        type="search"
        placeholder="Search products…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search"
      />
      <button className="btn btn-outline-dark" type="submit">
        Search
      </button>
      {q && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={clearSearch}
        >
          Clear
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
                Wishlist
                {wishlistCount > 0 && (
                  <span className="badge bg-danger ms-1">{wishlistCount}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link">
                Cart
                {cartCount > 0 && (
                  <span className="badge bg-primary ms-1">{cartCount}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className="nav-link">
                Profile
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
