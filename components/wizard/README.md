# Wizard UI Notes

- `SystemSetup` exposes COP inputs for both baseline and Daikin inverter systems under Advanced Settings. Values are optional, numeric-only, and pass through to downstream assumptions.
- Backend consumers should prioritize `cop47` for standard heating loads and fall back to `cop17` when low-ambient adjustments are required. When only `cop17` is provided, the UI surfaces a helper banner so analysts are aware of the fallback.
- Tooltips describe AHRI reference points for each COP input. Errors announce via `aria-live="assertive"` for accessibility.
