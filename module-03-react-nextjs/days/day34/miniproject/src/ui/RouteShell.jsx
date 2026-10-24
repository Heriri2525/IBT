import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import { PageCrashed } from "./Fallbacks";
import { PageSkeleton } from "./Skeleton";

// The pair from the slides: boundary OUTSIDE, Suspense INSIDE.
//   chunk downloading -> Suspense fallback (skeleton)
//   download fails / page throws -> boundary fallback
// `key` = pathname, so navigating away from a crashed page recovers.
function RouteShell() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary key={pathname} name="page" fallback={PageCrashed}>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

export default RouteShell;
