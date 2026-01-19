import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products.api";
import { fetchCategories } from "../api/categories.api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

// Default category images for display
const categoryImages = {
  "cat-men":
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=60",
  "cat-women":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60",
  "cat-kids":
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=60",
  "cat-accessories":
    "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&auto=format&fit=crop&q=60",
  "cat-footwear":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let alive = true;

    async function loadData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        if (!alive) return;

        setProducts(productsData || []);
        // Add images to categories
        const categoriesWithImages = (categoriesData || []).map((cat) => ({
          ...cat,
          image: categoryImages[cat._id] || categoryImages["cat-accessories"],
        }));
        setCategories(categoriesWithImages);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadData();
    return () => {
      alive = false;
    };
  }, []);

  // Get featured products (top rated)
  const featuredProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  // Get new arrivals (most recent)
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  if (loading) return <Loader label="Loading..." />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden mb-5">
        <div
          className="hero-bg position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            zIndex: -1,
          }}
        />
        <div className="container py-5">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-6 text-white">
              <span
                className="badge bg-warning text-dark px-3 py-2 mb-3"
                style={{ animation: "fadeInUp 0.6s ease-out" }}
              >
                ✨ New Collection 2026
              </span>
              <h1
                className="display-3 fw-bold mb-4"
                style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
              >
                Elevate Your
                <span
                  className="d-block"
                  style={{
                    background:
                      "linear-gradient(90deg, #ffd700, #ff6b6b, #4ecdc4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Style Game
                </span>
              </h1>
              <p
                className="lead mb-4 opacity-75"
                style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
              >
                Discover curated fashion that speaks to your unique personality.
                From streetwear essentials to timeless classics.
              </p>
              <div
                className="d-flex gap-3 flex-wrap"
                style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}
              >
                <Link
                  to="/products"
                  className="btn btn-light btn-lg px-4 py-2 rounded-pill fw-semibold"
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Shop Now →
                </Link>
                <Link
                  to="/products"
                  className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill"
                >
                  View Lookbook
                </Link>
              </div>
            </div>
            <div
              className="col-lg-6 d-none d-lg-block"
              style={{ animation: "fadeInRight 0.8s ease-out 0.4s both" }}
            >
              <div className="position-relative">
                <div
                  className="hero-image-wrapper rounded-4 overflow-hidden shadow-lg"
                  style={{
                    transform: "rotate(3deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format&fit=crop&q=80"
                    alt="Fashion Hero"
                    className="img-fluid"
                    style={{ height: 450, objectFit: "cover", width: "100%" }}
                  />
                </div>
                <div
                  className="position-absolute bg-white rounded-3 shadow-lg p-3"
                  style={{
                    bottom: -20,
                    left: -30,
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3">🔥</span>
                    <div>
                      <div className="fw-bold text-dark">Trending Now</div>
                      <small className="text-muted">
                        500+ items sold today
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-light py-4 mb-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              {
                icon: "🚚",
                title: "Free Shipping",
                desc: "On orders over ₹999",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "30-day return policy",
              },
              { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
              {
                icon: "💬",
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <span className="fs-2 mb-2">{feature.icon}</span>
                  <h6 className="mb-1">{feature.title}</h6>
                  <small className="text-muted">{feature.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">Shop by Category</h2>
          <p className="text-muted">Find exactly what you're looking for</p>
        </div>
        <div className="row g-4">
          {categories.map((cat, i) => (
            <div className="col-6 col-lg-3" key={cat._id}>
              <Link
                to={`/products?category=${cat._id}`}
                className="text-decoration-none"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div
                  className="category-card position-relative rounded-4 overflow-hidden"
                  style={{
                    height: 280,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-3"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    }}
                  >
                    <h5 className="text-white mb-0 fw-bold">{cat.name}</h5>
                    <small className="text-white-50">Explore →</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Featured Products</h2>
            <p className="text-muted mb-0">Handpicked just for you</p>
          </div>
          <Link
            to="/products"
            className="btn btn-outline-dark rounded-pill px-4"
          >
            View All
          </Link>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {featuredProducts.map((product, i) => (
            <div
              className="col"
              key={product._id}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mb-5">
        <div
          className="rounded-4 overflow-hidden position-relative"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: 300,
          }}
        >
          <div className="row align-items-center h-100">
            <div className="col-lg-6 p-5 text-white">
              <span className="badge bg-white text-dark mb-3">
                Limited Time Offer
              </span>
              <h2 className="display-5 fw-bold mb-3">
                Get 30% Off
                <br />
                Your First Order
              </h2>
              <p className="mb-4 opacity-75">
                Use code <strong className="text-warning">WELCOME30</strong> at
                checkout
              </p>
              <Link
                to="/products"
                className="btn btn-light btn-lg rounded-pill px-4 fw-semibold"
              >
                Claim Offer
              </Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60"
                alt="Promo"
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  maxHeight: 280,
                  objectFit: "cover",
                  transform: "rotate(-5deg)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-light py-5 mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">New Arrivals</h2>
              <p className="text-muted mb-0">Fresh drops you'll love</p>
            </div>
            <Link to="/products" className="btn btn-dark rounded-pill px-4">
              Shop New
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {newArrivals.map((product, i) => (
              <div
                className="col"
                key={product._id}
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mb-5">
        <div
          className="rounded-4 p-5 text-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          }}
        >
          <h3 className="text-white fw-bold mb-2">Stay in the Loop</h3>
          <p className="text-white-50 mb-4">
            Subscribe for exclusive deals, new arrivals, and style tips
          </p>
          <form
            className="d-flex gap-2 justify-content-center flex-wrap"
            style={{ maxWidth: 500, margin: "0 auto" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              className="form-control form-control-lg rounded-pill px-4"
              placeholder="Enter your email"
              style={{ flex: "1 1 300px" }}
            />
            <button
              type="submit"
              className="btn btn-warning btn-lg rounded-pill px-4 fw-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .min-vh-50 {
          min-height: 50vh;
        }
        
        .category-card img {
          transition: transform 0.5s ease;
        }
        
        .category-card:hover img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
