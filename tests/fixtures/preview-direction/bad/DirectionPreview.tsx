import * as React from "react";

// Demo toggle for the Select component page.
export function DirectionPreview({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr");
  React.useEffect(() => {
    document.documentElement.dir = dir;               // mutates the whole docs site
    localStorage.setItem("site-dir", dir);            // and persists it
  }, [dir]);
  return (
    <div>
      <button onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}>RTL</button>
      {children}
    </div>
  );
}
