import { useState } from "react";

export default function FilterSidebar({
  // Why props?
  // Because FilterSidebar ko dumb (presentational) rakhna hai.
  // State yaha rakhega to later:
  // 	•	same filter logic wishlist page pe reuse mushkil
  // 	•	debugging messy
  // 	•	“single source of truth” breaks
  // So, parent component se props ke through data aur event handlers pass karenge.
  categories,
  filters,
  onToggleCategory,
  onChangeRating,
  onChangeSort,
  onClear,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const FilterContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Filters</h5>
        <button
          className="btn btn-sm btn-outline-dark"
          type="button"
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      {/* Category */}
      <div className="mb-3">
        <h6 className="text-muted text-uppercase">Category</h6>
        {categories.map((c) => (
          <div className="form-check" key={c._id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`cat-${c._id}`}
              checked={filters.categoryIds.has(c._id)} //checked is controlled by parent state.
              // has() ka matlab: agar Set me id present hai to checkbox tick.
              //agar nahi hai to untick. Set is liye use kiya hai taaki multiple categories ko efficiently track kar sake.it will not store duplicate ids.
              onChange={() => onToggleCategory(c._id)}
            />
            <label className="form-check-label" htmlFor={`cat-${c._id}`}>
              {c.name}
            </label>
          </div>
        ))}
      </div>

      {/* Ratings */}
      <div className="mb-3">
        <h6 className="text-muted text-uppercase">Rating</h6>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => onChangeRating(Number(e.target.value))}
        />
        <small className="text-muted">Min: {filters.minRating} ⭐</small>
      </div>

      {/* Sort */}
      <div>
        <h6 className="text-muted text-uppercase">Sort by Price</h6>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortPrice"
            id="sortLowHigh"
            checked={filters.sort === "LOW_TO_HIGH"}
            onChange={() => onChangeSort("LOW_TO_HIGH")}
          />
          <label className="form-check-label" htmlFor="sortLowHigh">
            Low to High
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortPrice"
            id="sortHighLow"
            checked={filters.sort === "HIGH_TO_LOW"}
            onChange={() => onChangeSort("HIGH_TO_LOW")}
          />
          <label className="form-check-label" htmlFor="sortHighLow">
            High to Low
          </label>
        </div>

        <button
          className="btn btn-sm btn-outline-secondary mt-2"
          type="button"
          onClick={() => onChangeSort(null)}
        >
          Remove Sort
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Button - visible only on small screens */}
      <div className="d-lg-none mb-3">
        <button
          className="btn btn-outline-dark w-100"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Filters" : "Show Filters"} 🔽
        </button>
      </div>

      {/* Desktop Sidebar - always visible on large screens */}
      <div className="d-none d-lg-block border rounded p-3 bg-light">
        <FilterContent />
      </div>

      {/* Mobile Collapsible Panel */}
      {isOpen && (
        <div className="d-lg-none border rounded p-3 bg-light mb-3">
          <FilterContent />
        </div>
      )}
    </>
  );
}
