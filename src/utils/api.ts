const BASE_API = "https://themealdb.com/api/json/v1/1";

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE_API}${path}`, { signal });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
