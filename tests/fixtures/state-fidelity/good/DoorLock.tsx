type LockState = "locked" | "unlocked" | "jammed";
const label: Record<LockState, string> = { locked: "Locked", unlocked: "Unlocked", jammed: "Jammed" };

export function DoorLock({ state, onToggle }: { state: LockState; onToggle: () => void }) {
  return (
    <div>
      <LockIllustration shackle={state === "locked" ? "closed" : "open"} fault={state === "jammed"} />
      <p>{label[state]}</p>
      <button role="switch" aria-checked={state === "locked"} aria-label="Door lock" disabled={state === "jammed"} onClick={onToggle}>
        {state === "locked" ? "Unlock" : "Lock"}
      </button>
    </div>
  );
}
