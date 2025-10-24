import axios from "axios";
import { HIS_API_URL, HIS_API_URL_1 } from "./config";

// Cấu hình mặc định
export const client_HIS_API_URL = axios.create({
  baseURL: HIS_API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
});

export const client_HIS_API_URL_1 = axios.create({
  baseURL: HIS_API_URL_1,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
});

// --- GET ---
export async function get(client, url, params = {}, headers = {}) {
  try {
    const resp = await client.get(url, { params, headers });
    // Trả về .data
    return resp.data;
  } catch (err) {
    console.error("GET request error:", err);
    throw err;
  }
}

// --- POST ---
export async function post(client, url, body = {}, headers = {}) {
  try {
    const resp = await client.post(url, body, { headers });
    return resp.data;
  } catch (err) {
    console.error("POST request error:", err);
    throw err;
  }
}