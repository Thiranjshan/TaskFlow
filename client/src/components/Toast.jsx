import { useEffect } from "react";
import { IconCheckCircle, IconX, IconSparkles } from "./Icons.jsx";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-icon">
        {type === "success" && <IconCheckCircle size={18} />}
        {type === "error" && <IconX size={18} />}
        {type === "info" && <IconSparkles size={18} />}
      </div>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}
