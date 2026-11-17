# Memory

## Libraries

Owner named the stack in the build brief (Next.js, TypeScript, Tailwind, Zustand, Recharts). Versions pinned exactly; `npm audit` on 2026-11-14: 0 vulnerabilities.

- 2026-11-14 · next 16.4.6 · app framework (owner-specified)
- 2026-11-14 · react / react-dom 19.2.9 · UI runtime
- 2026-11-14 · zustand 5.0.16 · shared demo state with localStorage persist (owner-specified)
- 2026-11-14 · recharts 3.10.1 · charts (owner-specified)
- 2026-11-14 · tailwindcss / @tailwindcss/postcss 4.3.4 · styling (owner-specified)
- 2026-11-14 · typescript 5.9.3 · types (dev)

No other packages were added. Icons are hand-drawn SVG in `components/Icon.tsx`, and animations are plain CSS.

## Decisions

- 2026-11-14 · Font is Poppins (owner asked for it instead of Urbanist), self-hosted from `app/fonts` via `next/font/local`, so builds work without network access.
- 2026-11-14 · Records persist in the browser (`localStorage`), not a JSON file on disk, because Vercel's filesystem is read-only at runtime.
