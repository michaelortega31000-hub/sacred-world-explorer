

## Plan: Fix React useState null Error

### Problem Analysis
The error `Cannot read properties of null (reading 'useState')` is caused by **duplicate React instances** in the Vite bundle. This happens when:
- Libraries like `@react-three/fiber`, `@react-three/drei`, and `three.js` bundle their own copy of React
- The Vite dependency cache still contains the old (conflicting) versions

The fix added to `vite.config.ts` (dedupe) is correct but **the Vite cache needs to be cleared** for it to take effect.

### Technical Solution

**1. Enhanced Vite Configuration**
Update `vite.config.ts` with:
- Force prebuild React packages with `optimizeDeps.include`
- Extend dedupe to cover three.js ecosystem
- Add force flag to rebuild dependencies

```text
+------------------------------------------+
|           vite.config.ts                 |
+------------------------------------------+
| optimizeDeps: {                          |
|   include: [                             |
|     "react",                             |
|     "react-dom",                         |
|     "react/jsx-runtime",                 |
|     "@react-three/fiber",                |
|     "@react-three/drei",                 |
|     "three"                              |
|   ],                                     |
|   force: true  // Force rebuild cache    |
| },                                       |
| resolve: {                               |
|   dedupe: [                              |
|     "react",                             |
|     "react-dom",                         |
|     "react/jsx-runtime",                 |
|     "three",                             |
|     "@react-three/fiber",                |
|     "@react-three/drei"                  |
|   ]                                      |
| }                                        |
+------------------------------------------+
```

**2. Why This Works**
- `optimizeDeps.include`: Forces Vite to prebundle these dependencies together, ensuring they share a single React instance
- `optimizeDeps.force`: Clears the cached dependencies on next build
- `dedupe`: Ensures all imports resolve to the same module instance

### Files to Modify

| File | Change |
|------|--------|
| `vite.config.ts` | Add `optimizeDeps` block with `include` and `force` settings |

### Expected Outcome
After applying this fix:
- The app will load without the `useState is null` error
- All 3D/AR components using `@react-three/*` will work correctly
- The Vite dev server will rebuild its dependency cache

### Note
The `force: true` option can be removed after confirming the fix works, as it slightly slows down cold starts.

