import axios from "axios";
import { HIS_API_URL, HIS_API_URL_1, AGENT_URL } from "./config";
import { openNotification } from "../utils/helpers";

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

export const local_agent = axios.create({
  baseURL: AGENT_URL,
  timeout: 30000,
  headers: { "Accept": "application/json" },
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

// --- GET agent ---
export async function get_agent(client, url, headers = {}) {
  try {
    const resp = await client.get(url, { headers });

    // Nếu status 2xx
    if (resp.status === 200) {
      openNotification("Thông báo", resp.data.detail, "success");
    }
    return resp.data;

  } catch (err) {
    // Lỗi từ server (status >= 400)
    if (err.response) {
      const status = err.response.status;
      const detail = err.response.data?.detail || "Có lỗi xảy ra";

      // Hiển thị notification
      openNotification(`Lỗi ${status}`, detail);

      // Trả về null để caller xử lý tiếp
      return null;
    } else {
      // Lỗi network, timeout,...
      openNotification("Lỗi mạng", err.message);
      return null;
    }
  }
}

// --- POST agnet ---
export async function post_agent(client, url, body = {}, headers = {}) {
  try {
    const resp = await client.post(url, body, { headers });
    return resp.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const detail = err.response.data?.detail || "Có lỗi xảy ra";

      openNotification(`Lỗi ${status}`, detail);

      return null;
    } else {
      // Lỗi network, timeout,...
      openNotification("Lỗi mạng", err.message);
      return null;
    }
  }
}