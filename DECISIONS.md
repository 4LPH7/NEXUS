# Architecture decisions

## Persistent background scene

Keep one full-page React Three Fiber canvas mounted behind the seven DOM sections. Camera position follows measured section progress from the shared scroll store. Lenis advances from the canvas frame callback, so scroll interpolation, measurements, and camera updates use one animation loop. Scroll events and resize/font changes refresh measurements; section progress remains reversible when scrolling upward.

Interactive experiments use separate canvases so pointer capture and lab state do not interfere with the background scene. The gallery and labs are lazy loaded. The background canvas is lazy loaded after the initial DOM is available.

## Shared controls

The existing Zustand settings store remains the interface for theme, particle intensity, motion intensity, and reduced motion. Theme changes update root CSS variables and are read by scene materials. Reduced motion is effective when either the operating system or the in-app setting requests it. Persisted values are validated and clamped before use.

## Failure and accessibility behavior

Canvas creation failure, rendering errors, and context loss expose a DOM fallback with retry. Page navigation and copy stay outside WebGL. Gallery dialogs trap keyboard focus, close on Escape, and return focus to their trigger. Lab controls support pointer/touch and keyboard inputs; touch gestures preserve vertical page scrolling.

## Verified limitations

- Browser checks run in Chromium with SwiftShader; this does not establish performance on physical GPUs or cover every browser engine.
- Screenshots and viewport overflow checks cover the six widths in the browser suite; other device sizes remain unverified.
- Reduced motion stops continuous scene motion and removes camera travel, while necessary UI state transitions may still occur.
- The performance tier is a small viewport/device heuristic, not a benchmark-driven GPU classifier.
- No Lighthouse report or deployment was run in this implementation pass.
