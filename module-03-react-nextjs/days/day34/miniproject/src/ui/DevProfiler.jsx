import { Profiler } from "react";

// Dev-only wrapper around React's <Profiler>: sums renders and render time
// per id into window.__profile, so a profile can be read in the console:
//   console.table(window.__profile)
// In production builds it renders its children and nothing else.
export default function DevProfiler({ id, children }) {
  if (!import.meta.env.DEV) return children;
  return (
    <Profiler
      id={id}
      onRender={(_id, _phase, actualDuration) => {
        window.__profile ??= {};
        const entry = (window.__profile[id] ??= { renders: 0, ms: 0 });
        entry.renders += 1;
        entry.ms += actualDuration;
      }}
    >
      {children}
    </Profiler>
  );
}
