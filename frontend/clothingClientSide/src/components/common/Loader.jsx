export default function Loader({ label = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border" role="status" aria-label={label} />
      <div className="text-muted mt-2">{label}</div>
    </div>
  );
}
