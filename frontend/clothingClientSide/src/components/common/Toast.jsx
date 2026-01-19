import { useEffect, useRef } from "react"; // React import

export default function ToastContainer({ toasts, onRemove }) {
  // Toast container component
  const timersRef = useRef(new Map()); // track active timers by toast id

  useEffect(() => {
    // set up timers for new toasts only
    toasts.forEach((t) => {
      if (!timersRef.current.has(t.id)) {
        const timer = setTimeout(() => {
          onRemove(t.id);
          timersRef.current.delete(t.id);
        }, t.duration ?? 1500); // default 1500ms
        timersRef.current.set(t.id, timer);
      }
    });

    // cleanup timers for removed toasts
    timersRef.current.forEach((timer, id) => {
      if (!toasts.find((t) => t.id === id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });
  }, [toasts, onRemove]);

  // cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1055, width: 360 }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`alert alert-${t.type || "dark"} shadow-sm mb-2`}
          role="alert"
        >
          <div className="d-flex justify-content-between align-items-start">
            <div>{t.message}</div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onRemove(t.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
