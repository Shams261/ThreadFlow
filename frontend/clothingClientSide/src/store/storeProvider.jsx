import {
  // React imports for context and hooks
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  // import store utilities
  ACTIONS,
  initialState,
  reducer,
  STORAGE_KEY,
  getCartCount,
} from "./store";

const StoreContext = createContext(null); // create context for global store

// Load state from localStorage

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // basic validation of structure
    if (!parsed?.cart?.items || !parsed?.wishlist?.ids) return null; // invalid structure means null
    return parsed; // valid parsed state
  } catch {
    return null;
  }
}

export function StoreProvider({ children }) {
  // Load saved state BEFORE first render (lazy initializer)
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const saved = loadFromStorage();
    return saved ?? initial;
  });

  // Track if we've hydrated to avoid overwriting on first render
  const isHydrated = useRef(false);

  // Mark as hydrated after first render
  useEffect(() => {
    isHydrated.current = true;
  }, []);

  // Persist on any state change (but skip the initial render)
  useEffect(() => {
    if (!isHydrated.current) return; // Don't persist on first render
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const value = useMemo(() => {
    const cartCount = getCartCount(state.cart.items);
    const wishlistCount = state.wishlist.ids.length;

    return { state, dispatch, cartCount, wishlistCount };
  }, [state]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  // custom hook to use the store
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
