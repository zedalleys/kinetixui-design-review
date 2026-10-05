import * as React from "react";
import { InfoIcon, CloseIcon } from "./icons";

// Role: "status indicator" and "dismiss". Sensible defaults, consumer-replaceable.
export function Alert({ icon = <InfoIcon />, dismissIcon = <CloseIcon />, onDismiss, children }: {
  icon?: React.ReactNode; dismissIcon?: React.ReactNode; onDismiss?: () => void; children: React.ReactNode;
}) {
  return (
    <div role="status" className="alert">
      <span className="alert-icon" aria-hidden="true">{icon}</span>
      <div>{children}</div>
      {onDismiss && <button aria-label="Dismiss" onClick={onDismiss}>{dismissIcon}</button>}
    </div>
  );
}
