# Adapter: Svelte

1. **Detect.** `svelte` in `package.json`, `*.svelte` files, `svelte.config.js`, SvelteKit, Storybook for Svelte.
2. **Where to look.** Component props (`export let` or runes `$props()`), snippets/slots (`{@render}` or `<slot>`), `$state`/`$derived` or stores, `<style>` (scoped by default), `:global()` usage, context API for theme/direction, actions (`use:`), transitions (`transition:`/`in:`/`out:`), tests, docs examples.
3. **Static inspection (V1).** Leads: `:global()` styles that leak; `{@html}`; actions or effects that write to `document`; stores/module state shared across instances; reactive statements with side effects; transitions without reduced-motion handling; `bind:` contracts and prop forwarding (`{...$$restProps}` / rest props) — verify names and ARIA reach the interactive element; missing `key` in `{#each}` where identity matters.
4. **Runtime / gated (V2–V3).** Gated: `svelte-check`, lint, component tests if safe. Runtime: dev/preview build in a browser (web adapter).
5. **Idiomatic checks.** Snippets/slots for composition; `$props()` rest forwarding to the interactive element; context for cross-cutting settings; scoped styles by default with narrow `:global()`; CSS variables for tokens; built-in transitions respecting reduced motion via media query.
6. **False positives.** Deliberate narrow `:global()` for third-party markup; `{@html}` of trusted static content.
7. **Verification ceiling.** Source → V1; checks/tests run → V2; browser → V3. This adapter has **not** been exercised against a real Svelte design system; treat its leads as unvalidated.
