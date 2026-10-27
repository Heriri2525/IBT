"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import useSWR from "swr";
import DishCard from "@/components/DishCard";
import DishSkeleton from "./DishSkeleton";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/lib/use-debounce";
import { getServerSnapshot, getSnapshot, hrefFor, setPage, setQuery, subscribe } from "./filter-store";

// Client shell around server content. {children} is page 1 rendered on the server
// (fast, indexable). The moment the person searches, filters or goes past page 1,
// the list comes from an SWR query instead.
export default function DishBrowser({ children, pageCount: firstPageCount }) {
  const { category, q, page, crash } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Deliberate failure to prove error.js: open /menu?crash=1
  if (crash) throw new Error("Deliberate crash from /menu?crash=1");

  // `draft` is what is typed; null means "show what the URL says". Debounce: wait 300 ms of silence.
  const [draft, setDraft] = useState(null);
  const debounced = useDebounce(draft ?? q, 300);
  const term = draft === null ? q : debounced;
  // keep the URL in step with the debounced term (a no-op when nothing changed)
  useEffect(() => { if (draft !== null) setQuery(debounced); }, [draft, debounced]);

  const searching = term !== "" || category !== "All" || page > 1;
  // null key = "nothing to fetch": the server-rendered first page is on screen
  const key = searching ? ["/api/dishes", { q: term, category, page }] : null;
  const { data, error, isValidating, mutate } = useSWR(key, fetcher, {
    keepPreviousData: true,    // old results stay visible while the next ones load: no flash
    revalidateOnFocus: false,  // the menu changes a few times a day, not while a tab is in the background
    dedupingInterval: 30_000,  // the same search within 30 s is answered from the cache
  });

  const pageCount = searching ? data?.pageCount ?? 1 : firstPageCount;
  const go = (n) => (e) => { e.preventDefault(); setPage(n); };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="search">Search the menu</label>
        <input id="search" type="search" placeholder="e.g. tibs, shiro, spicy…" autoComplete="off"
          value={draft ?? q} onChange={(e) => setDraft(e.target.value)} />
      </div>

      {!searching ? (
        children
      ) : error ? (
        <p className="banner" role="alert">
          Couldn’t load dishes ({error.message}).{" "}
          <button className="btn alt" onClick={() => mutate()}>Try again</button>
        </p>
      ) : !data ? (
        <DishSkeleton />
      ) : data.dishes.length === 0 ? (
        <p className="muted">No dishes match{term ? ` “${term}”` : ""}.</p>
      ) : (
        <ul className="grid" style={{ opacity: isValidating ? 0.55 : 1 }} data-testid="results" aria-busy={isValidating}>
          {data.dishes.map((d) => <li key={d.id}><DishCard dish={d} /></li>)}
        </ul>
      )}

      {pageCount > 1 && (
        <nav className="row" aria-label="Pages" style={{ marginTop: "1rem" }}>
          {page > 1 && <a className="btn alt" href={hrefFor({ category, q: term, page: page - 1 })} onClick={go(page - 1)}>← Previous</a>}
          <span data-testid="page-of">Page {page} of {pageCount}</span>
          {page < pageCount && <a className="btn alt" href={hrefFor({ category, q: term, page: page + 1 })} onClick={go(page + 1)}>Next →</a>}
        </nav>
      )}
    </div>
  );
}
