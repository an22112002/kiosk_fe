import { get, post } from "./request";
import { HIS_API_URL, HIS_API_URL_1, HIS_MERCHANT_ID } from "./config";
import { convertDateFormat } from "../utils/helpers/index";
import { encodeHMACSHA265 } from "../utils/helpers/encrypt";

// --- GET danh sách tỉnh ---
export async function getProvince() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(HIS_API_URL, "/tinh-huyen-xa2", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET danh sách quốc tịch ---
export async function getNationality() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(HIS_API_URL, "/quoc-gia", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET dân tộc ---
export async function getEthnic() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(HIS_API_URL, "/dan-toc", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET nghề nghiệp ---
export async function getOccupations() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(HIS_API_URL_1, "/nghe-nghiep", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET dịch vụ khám ---
export async function getClinicServices() {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
  return get(HIS_API_URL_1, "/dich-vu-tree", {}, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET thông tin bệnh nhân ---
export async function getPatientInfo(patientIDCard) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`);
  return get(HIS_API_URL_1, "/benhnhan", {
    SO_GTTT: patientIDCard,
    LOAI_GTTT: "CCCD",
  }, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET bảo hiểm ---
export async function getPatientInsurance(patientIDCard, patientName, patientDOB) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`);
  return get(HIS_API_URL_1, "/bhyt", {
    SO_GTTT: patientIDCard,
    LOAI_GTTT: "CCCD",
    HO_TEN: patientName,                // Axios tự encode UTF-8
    NGAY_SINH: convertDateFormat(patientDOB),
  }, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}

// --- GET trạng thái thanh toán ---
export async function getCheckStatusPayment(soPhieu, maHoSo) {
  const timestamp = Date.now().toString();
  const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}|${soPhieu}|${maHoSo}`);
  return get(HIS_API_URL_1, "/CheckStatusPayment", {
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
  return post(HIS_API_URL_1, "/dangky-kcb", data, {
    "x-sign": sign,
    "x-merchant-id": HIS_MERCHANT_ID,
    "x-timestamp": timestamp,
  });
}
