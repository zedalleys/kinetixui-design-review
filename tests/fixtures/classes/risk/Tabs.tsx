import * as React from "react";

// Unmounts the previous panel after its fade-out finishes.
// 300 must equal `.panel { transition: opacity 300ms }` in tabs.css (no shared token, no test links them).
const FADE_MS = 300;

export function Tabs({ panels, active }: { panels: Record<string, React.ReactNode>; active: string }) {
  const [shown, setShown] = React.useState(active);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(active), FADE_MS);
    return () => clearTimeout(t);
  }, [active]);
  return <div role="tabpanel" className="panel">{panels[shown]}</div>;
}
