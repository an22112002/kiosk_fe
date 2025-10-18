import * as CryptoJS from "crypto-js";
import { HIS_SECRET_KEY } from "../../api/config";

export const encodeHMACSHA265 = async (message) => {
	const hash = CryptoJS.HmacSHA256(message, HIS_SECRET_KEY);
	const hashInBase64 = CryptoJS.enc.Hex.stringify(hash);
	return hashInBase64;
};
