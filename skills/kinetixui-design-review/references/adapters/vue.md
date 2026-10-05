# Adapter: Vue

1. **Detect.** `vue` in `package.json`, `*.vue` single-file components, `vite.config` with the Vue plugin, Nuxt, Vue Test Utils, Histoire/Storybook for Vue.
2. **Where to look.** SFC `<script setup>`/options API, `defineProps`/`defineEmits`/`defineModel`, slots (named/scoped), `<style scoped>`/CSS modules/`v-bind()` in CSS, provide/inject for theme or direction, composables, `Teleport` targets, tests (`*.spec.ts` with Vue Test Utils), docs examples.
3. **Static inspection (V1).** Leads: props mutated directly; `v-model` handling via `defineModel` vs manual emit; attribute fallthrough (`inheritAttrs`, `$attrs`) — a name or ARIA attribute may land on the root element, not the interactive inner element; `v-html`; scoped styles that cannot reach slot content or teleported content; watchers with side effects on globals; direction/theme set on `document` from component code; `v-for` without stable `:key`.
4. **Runtime / gated (V2–V3).** Gated: type-check (`vue-tsc`), lint, Vue Test Utils/Vitest tests if safe to run. Runtime: dev/preview build in a browser (web adapter); check teleported content's direction/theme and the inner control's accessible name.
5. **Idiomatic checks.** Slots for composition; `defineModel`/props+emits for v-model contracts; provide/inject for cross-cutting settings; `inheritAttrs: false` with `v-bind="$attrs"` placed on the interactive element when needed; CSS variables for tokens.
6. **False positives.** Scoped styles that intentionally do not leak; `v-html` of trusted static content; `$attrs` passthrough that is intentionally on the root.
7. **Verification ceiling.** Source → V1. Tests/type-check run → V2. Browser → V3. This adapter has **not** been exercised against a real Vue design system; treat its leads as unvalidated.
