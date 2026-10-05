export function DoorLock({ locked, onToggle }: { locked: boolean; onToggle: () => void }) {
  const [text, setText] = useState("Unlocked");
  return (
    <div>
      {/* illustration is hard-wired to the closed padlock */}
      <LockIllustration shackle="closed" />
      <p>{text}</p>
      <button aria-checked={locked} onClick={() => { setText("Unlocked"); onToggle(); }}>Unlock</button>
    </div>
  );
}
