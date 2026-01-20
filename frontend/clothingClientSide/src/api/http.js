const RAW_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, ""); // trailing / hatao

async function request(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${cleanPath}`, {
    // Allow callers to override anything via `options`, but keep sane defaults
    ...options,
    credentials: options.credentials ?? "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // 204 No Content
  if (res.status === 204) return null;

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }

  return data;
}

export const httpGet = (path) => request(path, { method: "GET" });
export const httpPost = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });
