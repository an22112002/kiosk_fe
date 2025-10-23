import axios from "axios";

// --- Tạo client chung ---
const client = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

// --- GET chung ---
export async function get(base, url, params = {}, headers = {}) {
  try {
    const resp = await client.get(url, {
      baseURL: base,
      params,              // Axios tự encode UTF-8
      headers,
    });
    return resp.data;     // Trả về .data như fetch.json()
  } catch (err) {
    console.error("GET request error:", err);
    throw err;
  }
}

// --- POST chung ---
export async function post(base, url, body = {}, headers = {}) {
  try {
    const resp = await client.post(url, body, {
      baseURL: base,
      headers,
    });
    return resp.data;     // Trả về .data
  } catch (err) {
    console.error("POST request error:", err);
    throw err;
  }
}
