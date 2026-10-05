import * as React from "react";

export function Alert({ onDismiss, children }: { onDismiss?: () => void; children: React.ReactNode }) {
  return (
    <div role="status" className="alert">
      <span className="alert-icon">ℹ</span>
      <div>{children}</div>
      {onDismiss && <button onClick={onDismiss}>✕</button>}
    </div>
  );
}
