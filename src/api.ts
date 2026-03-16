const BASE_URL = "https://business-api.tiktok.com/open_api/v1.3";

export interface ApiOptions {
  accessToken: string;
  method?: "GET" | "POST";
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
}

export async function callApi(
  endpoint: string,
  opts: ApiOptions
): Promise<unknown> {
  const method = opts.method ?? "GET";
  let url = `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Access-Token": opts.accessToken,
    "Content-Type": "application/json",
  };

  if (method === "GET" && opts.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(opts.params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          searchParams.set(key, JSON.stringify(value));
        } else {
          searchParams.set(key, String(value));
        }
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const fetchOpts: RequestInit = { method, headers };
  if (method === "POST" && opts.body) {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, fetchOpts);
  const json = (await res.json()) as {
    code: number;
    message: string;
    data: unknown;
  };

  if (json.code !== 0) {
    throw new Error(json.message || `API error code ${json.code}`);
  }

  return json.data;
}
