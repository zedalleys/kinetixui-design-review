import * as React from "react";
import { DirectionProvider } from "@acme/ui";

// Direction is scoped to this preview's own container and handed to portaled
// overlays through the provider; nothing outside the container changes.
export function DirectionPreview({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr");
  return (
    <section dir={dir} data-preview-root>
      <button aria-pressed={dir === "rtl"} onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}>RTL</button>
      <DirectionProvider dir={dir} container="[data-preview-root]">
        {children}
      </DirectionProvider>
    </section>
  );
}
