const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function httpGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    // ✅ Sahi
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function httpPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    // ✅ Sahi
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
