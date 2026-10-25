import { useCallback, useEffect, useState } from "react";

// Custom hook: shares the LOGIC (state + effect + cleanup), never the data.
// `url` is in the dependency array, so navigating /menu/doro-wat -> /menu/kitfo
// (or changing the category) cancels the old request and fetches the new one.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 404) {
          setNotFound(true);
          setData(null);
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load the Addis Eats menu.");
        }

        setData(await response.json());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, notFound, retry };
}
