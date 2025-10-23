import { notification } from "antd";

notification.config({
  placement: "topRight",
  duration: 10,
  getContainer: () => document.body,
});

export const openNotification = (
	message,
	description,
	type = "error" // "success" | "info" | "warning" | "error"
) => {
	const content = {
		message: message,
		description: description,
		duration: 10,
	};

	switch (type) {
		case "success":
			notification.success(content);
			break;

		case "info":
			notification.info(content);
			break;

		case "warning":
			notification.warning(content);
			break;

		case "error":
			notification.error(content);
			break;

		default:
			notification.error(content);
			break;
	}
};

export const splitName = (fullName) => {
	const parts = fullName.trim().split(/\s+/);
	const lastName = parts[0];
	const firstName = parts.slice(1).join(" ");
	return { firstName, lastName };
};

export const parseDateFromDDMMYYYY = (dateString) => {
	const [day, month, year] = dateString.split("/").map(Number);
	return new Date(year, month - 1, day);
};

export const formatCurrency = (amount) => {
	return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
};

export const calculateAge = (birthday) => {
	const birthdayDate = parseDateFromDDMMYYYY(birthday);
	if (!birthdayDate) return "N/A";
	else {
		const ageDifMs = Date.now() - birthdayDate.getTime();
		const ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
};

export const isValidJSON = (data) => {
	try {
		if (typeof data !== "string") {
			return false;
		}

		// Thử parse data
		JSON.parse(data);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const convertDateFormat = (input) => {
	if (input === "") return "";
	else {
		const [day, month, year] = input
			.split("/")
			.map((part) => parseInt(part, 10));

		const date = new Date(year, month - 1, day); // Month is 0-based in JS

		// Format to yyyy-MM-dd
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		return `${yyyy}-${mm}-${dd}`;
	}
};

export const convertDateFormat2 = (input) => {
	if (input === "") return "";
	else {
		const [day, month, year] = input
			.split("/")
			.map((part) => parseInt(part, 10));

		const date = new Date(year, month - 1, day); // Month is 0-based in JS

		// Format to yyyy-MM-dd
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		return `${dd}-${mm}-${yyyy}`;
	}
};

export const convertTelexToVietnamese = (input) => {
  const telexMap = {
    aw: "ă",
    aa: "â",
    dd: "đ",
    ee: "ê",
    oo: "ô",
    ow: "ơ",
    uw: "ư",
  };

  const toneMap = {
    s: "\u0301", // sắc
    f: "\u0300", // huyền
    r: "\u0309", // hỏi
    x: "\u0303", // ngã
    j: "\u0323", // nặng
  };

  const vowels = "aăâeêioôơuưy";

  const convertWord = (word) => {
    let text = word.toLowerCase();

    // 1. Thay âm chính
    for (const [rule, letter] of Object.entries(telexMap)) {
      text = text.replace(new RegExp(rule, "g"), letter);
    }

    // 2. Kiểm tra ký tự cuối là dấu thanh
    let tone = "";
    const lastChar = text.slice(-1);
    if (toneMap[lastChar]) {
      tone = toneMap[lastChar];
      text = text.slice(0, -1);
    }

    if (tone) {
      // 3. Chọn nguyên âm để gán dấu
      const chars = [...text];

      // Nguyên tắc: ưu tiên các nguyên âm chính theo thứ tự a, ă, â, e, ê, i, o, ô, ơ, u, ư, y
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (vowels.includes(c)) {
          chars[i] = c + tone;
          break;
        }
      }

      text = chars.join("");
    }

    return text.normalize("NFC");
  };

  return input
    .split(/\s+/)
    .map((w) => convertWord(w))
    .join(" ");
};

export const processVietnameseBuffer = (buffer) => {
  if (!buffer) return "";

  // 1. Chuyển Telex sang tiếng Việt
  let vietnamese = convertTelexToVietnamese(buffer);

  // 2. Viết hoa chữ cái đầu mỗi từ
  vietnamese = vietnamese
    .split(" ")
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : "")
    .join(" ");

  return vietnamese;
}