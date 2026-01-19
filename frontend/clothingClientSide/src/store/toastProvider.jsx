import { createContext, useContext, useMemo, useState } from "react"; // React imports
import ToastContainer from "../components/common/Toast"; // Toast container component

const ToastContext = createContext(null); // create Toast context

// simple unique ID generator for toasts helps to identify each toast
function uid() {
  return `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`; // unique ID generation logic
}

export function ToastProvider({ children }) {
  // Toast provider component
  const [toasts, setToasts] = useState([]); // state to hold active toasts

  function showToast(message, options = {}) {
    // function to show a new toast
    const id = uid();
    const toast = {
      // toast object structure
      id,
      message,
      type: options.type || "dark", // success | danger | warning | dark | info
      duration: options.duration ?? 1500, // duration in ms
    };
    setToasts((prev) => [toast, ...prev]);
  }

  function removeToast(id) {
    // function to remove a toast by ID
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    // provide the context value to children
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
// custom hook to use the Toast context

export function useToast() {
  const ctx = useContext(ToastContext); // get context value
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>"); // error if used outside provider
  return ctx;
}
