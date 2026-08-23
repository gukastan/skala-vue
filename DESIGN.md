# Weather Pet Design System

## 1. Atmosphere & Identity

Weather Pet feels like a playful learning studio running inside a small desktop app. Warm cream panels, lavender workspace surfaces, pink actions, brown outlines, and pixel-art scenery make the interface feel tactile without hiding the Vue concepts being taught. The signature is the connection between a visible pet reaction and the state-change flow that produced it.

## 2. Color

### Palette

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Text / primary | `--ink` | `#302448` | Headings and important labels |
| Text / secondary | `--muted` | `#736789` | Body copy and supporting labels |
| Border / soft | `--line` | `#e8c9d1` | Quiet dividers and inset borders |
| Border / strong | `--line-strong` | `#8c6a58` | Desktop-window and raised-panel outlines |
| Accent / primary | `--blue` | `#ee7094` | Primary actions and highlighted text; historical token name retained |
| Accent / strong | `--accent-strong` | `#d65f83` | Active labels and emphasis |
| Accent / deep | `--accent-deep` | `#a83b61` | Small accent text that requires stronger contrast |
| Surface / panel | `--panel` | `#fff7ed` | Main cards and readable content surfaces |
| Surface / cream | `--cream` | `#fff0c9` | App chrome and warm callout surfaces |
| Surface / soft | `--surface-soft` | `#fff8e7` | Low-emphasis sections |
| Surface / lavender | `--lavender` | `#cdb9ef` | Workspace background and visual bands |
| Surface / mint | `--mint` | `#d7f0d2` | Positive or pet-related supporting surfaces |
| Depth / pink | `--shadow-pink` | `#c88fa8` | Raised pixel-style panel shadows |

### Rules

- Pink marks actions and important learning transitions; it is not general decoration.
- Cream and panel surfaces carry readable content. Lavender remains the surrounding workspace.
- Brown outlines and pink shadows must share a consistent top-left light direction.
- New colors are added here before use. Existing practice examples may retain their lesson-specific legacy palette.

## 3. Typography

### Scale

| Level | Size | Weight | Line height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | `32px` | 800 | 1.15 | `-0.04em` | Service hero title |
| H1 | `28px` | 800 | 1.2 | `-0.03em` | Page titles |
| H2 | `22px` | 800 | 1.25 | `-0.02em` | Major sections |
| H3 | `18px` | 800 | 1.35 | `-0.01em` | Panel titles |
| Body | `14px` | 500 | 1.6 | 0 | Primary explanatory copy |
| Body / small | `12px` | 500 | 1.55 | 0 | Secondary copy |
| Caption | `11px` | 700 | 1.4 | `0.04em` | Metrics and compact labels |
| Overline | `10px` | 800 | 1.3 | `0.12em` | Uppercase section labels |

### Font stack

- Primary: `Inter, 'Noto Sans KR', system-ui, sans-serif`
- Mono: `'Courier New', monospace`

### Rules

- Korean display text uses balanced wrapping; body text uses pretty wrapping.
- Body copy on the service page never drops below 12px in the app's natural layout.
- Numeric proof points use tabular figures.

## 4. Spacing & Layout

### Base unit

All layout spacing uses a 4px base.

| Token | Value | Usage |
| --- | --- | --- |
| `--space-1` | `4px` | Tight icon or label spacing |
| `--space-2` | `8px` | Inline clusters |
| `--space-3` | `12px` | Compact panel spacing |
| `--space-4` | `16px` | Default inner spacing |
| `--space-5` | `20px` | Comfortable panel padding |
| `--space-6` | `24px` | Major panel padding |
| `--space-8` | `32px` | Major separation |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `--radius-xs` | `6px` | Compact chips |
| `--radius-sm` | `8px` | Small flow cells |
| `--radius-md` | `10px` | Action links |
| `--radius-lg` | `12px` | Nested panels |
| `--radius-xl` | `14px` | Scene and proof strip |
| `--radius-2xl` | `16px` | Explanation panels |
| `--radius-3xl` | `20px` | Hero panel |

### Grid

- Natural app width: `1240px`; content viewport: `1204px` after page padding.
- Service page uses an asymmetric hero followed by a two-column explanation grid.
- Browser-width responsiveness is handled by the app shell's uniform scale behavior. The service page preserves its natural grid so no inner section reflows independently and becomes clipped inside the fixed app viewport.

## 5. Components

### Raised panel

- **Structure:** semantic `section` or `article` with title and supporting content.
- **Variants:** cream, panel, mint, visual scene.
- **Spacing:** `--space-4` through `--space-6`.
- **States:** static; interactive variants must use the action-link states below.
- **Accessibility:** headings follow document order and do not rely on color alone.
- **Motion:** none.
- **Layout:** stack or grid; no internal scroll owner.

### Action link

- **Structure:** Vue Router link with explicit destination text.
- **Variants:** primary filled, secondary text link.
- **Spacing:** `--space-2`, `--space-3`, and `--space-4`.
- **States:** default, hover, active, and `:focus-visible`; no disabled state because every link has a valid route.
- **Accessibility:** visible focus outline, descriptive Korean text, minimum 40px natural hit height.
- **Motion:** none; state changes are immediate and tactile.
- **Layout:** inline cluster.

### Learning flow

- **Structure:** ordered list of compact steps joined by directional connectors.
- **Variants:** product flow and Vue reactivity flow.
- **Spacing:** `--space-2` and `--space-3`.
- **States:** static.
- **Accessibility:** real ordered-list semantics; arrows are decorative.
- **Motion:** none.
- **Layout:** horizontal cluster that wraps without horizontal scrolling.

### Proof metric

- **Structure:** numeric or short-text value with a plain-language label.
- **Variants:** number, API fallback text.
- **Spacing:** `--space-1` and `--space-3`.
- **States:** static.
- **Accessibility:** meaning remains clear without the value's accent color.
- **Motion:** none.
- **Layout:** three-cell grid that collapses when content space is narrow.

### API data panel

- **Structure:** semantic `article` with a title, OpenWeatherMap source label, timestamp or coverage note, and a compact data region.
- **Variants:** five-day forecast and current air quality.
- **Spacing:** `--space-2` through `--space-4`; repeated forecast cells use the overflow-safe intrinsic grid pattern.
- **States:** loading, live data, partial API failure, and key-missing fallback. A failed panel keeps its heading and shows a plain-language recovery message.
- **Accessibility:** values always include visible text labels and units; air-quality meaning never relies on color alone.
- **Motion:** none.
- **Layout:** the detail page owns vertical scrolling; panel contents do not introduce nested vertical scrollbars.

## 6. Motion & Interaction

The service introduction uses no decorative animation. Hover, active, and focus changes on action links communicate interactivity immediately without timed motion. Existing application transitions may continue to use transform and opacity only. `prefers-reduced-motion` must never remove information.

## 7. Depth & Surface

Strategy: mixed, matching the existing pixel-inspired desktop shell.

| Level | Treatment | Usage |
| --- | --- | --- |
| Soft | `2px` tinted border | Nested information blocks |
| Raised | `3px` strong border + `0 4px 0 var(--shadow-pink)` | Primary content panels |
| Prominent | Existing multi-layer desktop-window shadow | App shell only |

Large shadows stay on major surfaces. Nested content uses tonal changes and soft borders to avoid card-on-card clutter.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 contrast for body text and 3:1 for large text and controls.
- Every link is keyboard reachable and has a visible `:focus-visible` treatment.
- Korean headings use balanced wrapping and cannot leave a single syllable or particle isolated.
- Meaningful imagery has descriptive alt text; decorative connectors are hidden from assistive technology.
- The page must preserve its complete hierarchy without clipping at 375px, 768px, and 1280px browser widths under the existing scaled desktop-shell behavior.

### Accepted debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
| The full desktop simulation scales down rather than becoming a native mobile layout. | `src/App.vue` shell | Existing product concept and outside this service-page redesign. | Revisit when the whole application receives a mobile-shell redesign. |
| Legacy lesson/practice CSS uses colors and sizes outside this extracted system. | `src/assets/exercise.css`, `src/assets/practice.css`, practice components | Preserves historical classroom examples and is outside the service introduction scope. | Consolidate only as a dedicated practice-system task. |
