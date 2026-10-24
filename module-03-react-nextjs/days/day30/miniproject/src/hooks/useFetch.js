import { useCallback, useEffect, useState } from "react";

// Custom hook: shares the LOGIC (state + effect + cleanup), never the data.
// Each component that calls useFetch gets its own data/loading/error.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to re-run the effect

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: controller.signal });

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

    // cleanup: cancel the request if url changes or the component unmounts
    return () => controller.abort();
  }, [url, attempt]);

  // stable function reference thanks to useCallback
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, retry };
}
