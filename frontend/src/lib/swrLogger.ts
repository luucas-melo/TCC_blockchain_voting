import { Middleware } from "swr";

export const logger: Middleware = (useSWRNext) => (key, fetcher, config) => {
  // Add logger to the original fetcher.
  const extendedFetcher = (...args: any[]) => {
    console.groupCollapsed("SWR Request:", key);
    console.log("key:", key);
    console.log("args:", args);
    console.log("config:", config);
    console.groupEnd();

    return fetcher!?.(...args);
  };

  // Execute the hook with the new fetcher.
  const swr = useSWRNext(key, extendedFetcher, config);

  const data = swr?.data;
  const error = swr?.error;

  console.groupCollapsed("SWR Response:", key);
  console.log("data:", data);
  console.log("error:", error);
  console.log("swr:", swr);
  console.groupEnd();

  return swr;
};
