# 08 — Animation and Microinteractions

> Pure CSS only (`css/app.css`); no animation library. All motion uses `--ease`.

## 8.1 Motion Inventory

| Animation | Location | Behavior |
|-----------|----------|----------|
| Screen entry | `#screen` + `@keyframes screenIn` | Fade + 10px rise, `.35s var(--ease)`, every render |
| Active tab | `.tab(.active)` + `::after` | Color/bg `.25s`, gold dot |
| Buttons | `.tb-btn`, `.tab` `:active` | Scale `.92–.94`, `.15s` |
| Prayer countdown | `home.js:tickCountdown` + `every(1000)` | `HH:MM:SS` + progress bar; cleaned on every render |
| Tasbih ring | `tasbih.js` (`stroke-dashoffset`) | Shrinks proportional to `count/target` |
| Compass needle | `#qibla-needle` | `transition:transform .12s linear` (sensor stream) |
| Haptics | `ui.js:vibrate` | Tasbih/Mathurat taps (10–12ms), completion pattern `[40,60,40]` |
| Focus | `:focus-visible` | 2px gold outline + offset |

## 8.2 Rules

1. Decorative motion only — never block input; honor `prefers-reduced-motion` for any significant new motion.
2. Screen timers must go through `every()` so `render()` cleans them (`clearTimers`) — no raw `setInterval` in features.
3. The compass handler streams transforms — never `render()` inside a sensor handler.
