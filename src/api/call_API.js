import { HIS_API_URL, HIS_API_URL_1, HIS_MERCHANT_ID } from "./config";
import { convertDateFormat } from "../utils/helpers/index";
import { encodeHMACSHA265 } from "../utils/helpers/encrypt";
import { get } from "./request"

export async function getProvince() {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);

    const respone = await get(HIS_API_URL, 
        "/tinh-huyen-xa2", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
    );
	return await respone.json()
}

export async function getNationality() {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);

    const respone = await get(HIS_API_URL, 
        "/quoc-gia", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
    );
	return await respone.json()
}

export async function getEthnic() {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
	const respone = await get(HIS_API_URL, 
        "/dan-toc", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
    );
	return await respone.json()
}

export async function getOccupations() {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
	const respone = await get(HIS_API_URL_1, 
        "/nghe-nghiep", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
    );
	return await respone.json()
}

export async function getClinicServices() {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(`${HIS_MERCHANT_ID}|${timestamp}`);
    const respone = await get(HIS_API_URL_1, 
        "/dich-vu-tree", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
    );
	return await respone.json()
}

export async function getPatientInfo(patientIDCard) {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(
		`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`
	);
    const respone = await get(HIS_API_URL_1, 
        "/benhnhan", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
        {
            SO_GTTT: patientIDCard, LOAI_GTTT: "CCCD"
        }
    );
	return await respone.json()
}

export async function getPatientInsurance(
	patientIDCard,
	patientName,
	patientDOB
) {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(
		`${HIS_MERCHANT_ID}|${timestamp}|${patientIDCard}|CCCD`
	);
    const respone = await get(HIS_API_URL_1, 
        "/bhyt", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
        {
            SO_GTTT: patientIDCard,
			LOAI_GTTT: "CCCD",
			HO_TEN: patientName,
			NGAY_SINH: convertDateFormat(patientDOB),
        }
    );
	return await respone.json()
}

export async function getCheckStatusPayment(soPhieu, maHoSo) {
	const timestamp = Date.now().toString();
	const sign = await encodeHMACSHA265(
		`${HIS_MERCHANT_ID}|${timestamp}|${soPhieu}|${maHoSo}`
	);
    const respone = await get(HIS_API_URL_1, 
        "/CheckStatusPayment", 
        {
			"Content-Type": "application/json",
			"x-sign": sign,
			"x-merchant-id": HIS_MERCHANT_ID,
			"x-timestamp": timestamp,
		},
        {
            SO_PHIEU: soPhieu,
			MA_HO_SO: maHoSo,
        }
    );
	return await respone.json()
}

