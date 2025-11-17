import { get, post, get_agent, post_agent, client_HIS_API_URL, client_HIS_API_URL_1, local_agent } from "./request";
import { HIS_MERCHANT_ID, AGENT_KEY } from "./config";
import { encodeHMACSHA265 } from "../utils/helpers/encrypt";

// --- GET danh sách tỉnh ---
export async function getProvince() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(client_HIS_API_URL, "/tinh-huyen-xa2", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET danh sách quốc tịch ---
export async function getNationality() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(client_HIS_API_URL, "/quoc-gia", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET dân tộc ---
export async function getEthnic() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(client_HIS_API_URL, "/dan-toc", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET nghề nghiệp ---
export async function getOccupations() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(client_HIS_API_URL_1, "/nghe-nghiep", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET dịch vụ khám ---
export async function getClinicServices() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(client_HIS_API_URL_1, "/dich-vu-tree", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET thông tin bệnh nhân ---
export async function getPatientInfo(patientIDCard) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`);
  return get(client_HIS_API_URL_1, "/benhnhan", {
    SO_GTTT: patientIDCard,
    LOAI_GTTT: "CCCD",
  }, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET bảo hiểm ---
// export async function getPatientInsurance(patientIDCard, patientName, patientDOB) {
//   const timestamp = Date.now().toString();
//   const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`);
//   return get(client_HIS_API_URL_1, "/bhyt", {
//     SO_GTTT: patientIDCard,
//     LOAI_GTTT: "CCCD",
//     HO_TEN: patientName,                // Axios tự encode UTF-8
//     NGAY_SINH: convertDateFormat(patientDOB),
//   }, {
//     "x-sign": sign,
//     "x-merchant-id": HIS_MERCHANT_ID,
//     "x-timestamp": timestamp,
//   });
// }

// --- GET trạng thái thanh toán ---
export async function getCheckStatusPayment(soPhieu, maHoSo) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${soPhieu}|${maHoSo}`);
  return get(client_HIS_API_URL_1, "/CheckStatusPayment", {
    SO_PHIEU: soPhieu,
    MA_HO_SO: maHoSo,
  }, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- POST đăng ký khám ---
export async function postMedicalRegister(data) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${data.THONG_TIN_BENH_NHAN.MA_BN}`);
  return post(client_HIS_API_URL_1, "/dangky-kcb", data, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET báo agnet thu nhỏ cửa sổ kiosk ---
export async function minimize_win() {
  return get_agent(local_agent, "/agent/api/minimize", {
    "x-agent-key": AGENT_KEY
  });
}

// --- GET báo agnet đóng cửa sổ kiosk ---
export async function close_win() {
  return get_agent(local_agent, "/agent/api/close_window", {
    "x-agent-key": AGENT_KEY
  });
}

// --- GET báo agnet mở trang đăng nhập BHYT ---
export async function openWebBHYT() {
  return get_agent(local_agent, "/agent/api/run_driver", {
    "x-agent-key": AGENT_KEY
  });
}

// --- GET báo agent lấy cookie ---
export async function getCookiesWebBHYT() {
  return get_agent(local_agent, "/agent/api/get_cookies", {
    "x-agent-key": AGENT_KEY
  });
}

// --- GET lấy thông tin tài khoản PIS ---
export async function getUserPIS() {
  return get_agent(local_agent, "/agent/api/getData", {
    "x-agent-key": AGENT_KEY
  });
}

// --- POST lấy thông tin bảo hiểm y tế ---
export async function saveUserPIS(username, password) {
  return post_agent(local_agent, "/agent/api/saveData", {
    USERNAME: username,
    PASSWORD: password,
  }, {
    "x-agent-key": AGENT_KEY
  });
}

// --- POST lấy thông tin bảo hiểm y tế ---
export async function get_bhyt(patientIDCard, patientName, patientDOB) {
  return post_agent(local_agent, "/agent/api/get_bhyt", {
    MA_CCCD: patientIDCard,
    HO_TEN: patientName,
    NGAY_SINH: patientDOB,
  }, {
    "x-agent-key": AGENT_KEY
  });
}