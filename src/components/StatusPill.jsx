export default function StatusPill({ status }) {
  return (
    <span className={`status-pill ${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
