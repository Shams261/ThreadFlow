import {
  // React imports for context and hooks
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from storage on mount means only once when component mounts
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) dispatch({ type: ACTIONS.HYDRATE, payload: saved });
  }, []);

  // Persist on any state change
  useEffect(() => {
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
