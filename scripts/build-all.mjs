await import('./references.mjs');
await import('./build.mjs');
await import('./render-diagrams.mjs');
// Reserve the rendered image dimensions before loading to keep deep links stable.
await import('./build.mjs?final-dimensions');
