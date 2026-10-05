import * as React from "react";
import { DirectionProvider } from "@acme/ui";

/**
 * DECISION (docs/adr-007): direction is applied to <html>, not the stage.
 * Overlays portal to document.body, outside the stage, so a stage-scoped `dir`
 * made a reader's Dialog demo appear unmirrored (measured). The whole page
 * mirroring is disclosed in the toolbar label "Mirrors the whole page".
 * Alternatives considered: per-preview iframe (rejected: weight on 98 pages).
 */
export function DirectionPreview({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr");
  React.useEffect(() => { document.documentElement.setAttribute("dir", dir); }, [dir]);
  return (
    <DirectionProvider dir={dir}>
      <button onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}>RTL — mirrors the whole page</button>
      {children}
    </DirectionProvider>
  );
}
