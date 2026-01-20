import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer border-top mt-auto">
      <div className="container py-4">
        <div className="row align-items-center gy-3">
          {/* Brand */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h5 className="fw-bold mb-1 fs-5">FitFinder</h5>
            <p className="text-muted small mb-0">
              Find your perfect fit. Clean styles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-4 text-center">
            <div className="d-flex gap-3 justify-content-center flex-wrap small">
              <Link className="footer-link" to="/products">
                Shop
              </Link>
              <Link className="footer-link" to="/wishlist">
                Wishlist
              </Link>
              <Link className="footer-link" to="/cart">
                Cart
              </Link>
              <Link className="footer-link" to="/profile">
                Profile
              </Link>
            </div>
          </div>

          {/* Social + Legal */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-flex gap-2 justify-content-center justify-content-md-end align-items-center flex-wrap">
              <a
                className="social-icon"
                href="#"
                aria-label="Twitter"
                title="Twitter"
              >
                𝕏
              </a>
              <a
                className="social-icon"
                href="#"
                aria-label="Instagram"
                title="Instagram"
              >
                📷
              </a>
              <a
                className="social-icon"
                href="#"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                💼
              </a>
              <span className="text-muted mx-2">|</span>
              <Link to="/" className="footer-link-sm">
                Privacy
              </Link>
              <Link to="/" className="footer-link-sm">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-3 pt-2 border-top">
          <small className="text-muted">© {year} FitFinder. Made with ❤️</small>
        </div>
      </div>
    </footer>
  );
}
