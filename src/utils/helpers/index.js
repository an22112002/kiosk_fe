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

// Các tiền tố cần loại bỏ khi chuẩn hóa tên
const removePart = [
  "TP", "Thành phố", "T.", "Thôn",
  "TX.", "Thị xã", "P.", "Phường", "X.", "Xã",
  "TT.", "Thị trấn", "Tỉnh"
];

// Chuẩn hóa tên địa danh: bỏ tiền tố, về lowercase, loại khoảng trắng thừa
const normalizeName = (name) => {
  if (!name) return "";
  let n = name.trim();
  removePart.forEach(rp => {
    const regex = new RegExp(`^${rp}\\s*`, "i");
    n = n.replace(regex, "").trim();
  });
  return n.toLowerCase();
};

// Tìm mã tương ứng trong danh sách
const findCodeByName = (str, list) => {
  if (!Array.isArray(list) || list.length === 0) return null;

  const isXa = "TEN_XA" in list[0];
  const keyName = isXa ? "TEN_XA" : "TEN_TINH";
  const keyCode = isXa ? "MA_XA" : "MA_TINH";

  const target = normalizeName(str);
  const found = list.find(item => normalizeName(item[keyName]) === target);
  return found ? found[keyCode] : null;
};

// Lấy mã xã và mã tỉnh từ chuỗi địa chỉ
export const getXaTinhCode = (addressStr, XA, TINH) => {
  if (!addressStr) return ["", ""];

  const parts = addressStr.split(",").map(p => p.trim());
  if (parts.length === 0) return ["", ""];

  const tinhStr = parts[parts.length - 1]; // phần cuối là tỉnh
  const maTinh = findCodeByName(tinhStr, TINH) || "";

  // thử từng phần còn lại (trừ phần tỉnh) để tìm xã
  let maXa = "";
  for (let i = 0; i < parts.length - 1; i++) {
    const code = findCodeByName(parts[i], XA);
    if (code) {
      maXa = code;
      break; // tìm thấy thì dừng
    }
  }
  return [maXa, maTinh];
};

// Lấy mã dân tộc
export const getDanTocCode = (race, ETHNIC) => {
  if (!race || !Array.isArray(ETHNIC) || ETHNIC.length === 0) return "";

  // chuẩn hóa chuỗi so khớp (bỏ khoảng trắng dư, không phân biệt hoa thường)
  const target = race.trim().toLowerCase();

  // xác định tên trường
  const keyName = ETHNIC[0].TEN_DT ? "TEN_DT" : null;
  const keyCode = ETHNIC[0].MA_DT ? "MA_DT" : null;

  if (!keyName || !keyCode) return "";

  // tìm phần tử trùng tên dân tộc
  const found = ETHNIC.find(item => item[keyName].trim().toLowerCase() === target);

  return found ? found[keyCode] : "";
};

export const convertTelexToVietnamese = (input) => {
	if (input.length === 1) {
		return input
	}

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

  	const vowels = ["a", "ă", "â", "e", "ê", "i", "o", "ô", "ơ", "u", "ư", "y"];

	// Các cụm nguyên âm và nguyên âm chính tương ứng
	const vowelRules = [
		["oa", "a"], ["oe", "e"], ["uy", "y"],
		["ai", "a"], ["ao", "a"], ["au", "a"], ["ay", "a"],
		["eo", "e"], ["êu", "ê"], ["iê", "ê"], ["yê", "ê"],
		["ua", "a"], ["uô", "ô"], ["ưa", "a"], ["ươ", "ơ"]
	];

  	// --- Xác định vị trí nguyên âm để đặt dấu đúng chuẩn Unikey ---
  	const chooseTonePosition = (chars) => {
    const vowelIndices = chars
      .map((c, i) => (vowels.includes(c.normalize("NFC")) ? i : -1))
      .filter((i) => i !== -1);

    if (vowelIndices.length === 0) return -1;
    if (vowelIndices.length === 1) return vowelIndices[0];

    const joined = chars.join("");

    if (joined.includes("ươ")) return joined.indexOf("ơ");
    if (joined.includes("iê")) return joined.indexOf("ê");
    if (joined.includes("yê")) return joined.indexOf("ê");
    if (joined.includes("uô")) return joined.indexOf("ô");
    if (joined.includes("ưa")) return joined.indexOf("a");
    if (joined.includes("ua")) return joined.indexOf("a");

    for (const c of ["â", "ă", "ê", "ô", "ơ", "ư"]) {
      const idx = joined.indexOf(c);
      if (idx !== -1) return idx;
    }

    for (const [pattern, mainVowel] of vowelRules) {
	const idx = joined.indexOf(pattern);
	if (idx !== -1) return idx + pattern.indexOf(mainVowel);
	}

	// Nếu có nguyên âm ưu tiên (â, ê, ô, ơ, ă, ư)
	for (const c of ["â", "ă", "ê", "ô", "ơ", "ư"]) {
	const idx = joined.indexOf(c);
	if (idx !== -1) return idx;
	}

	// Nếu không có quy tắc nào khớp → chọn nguyên âm đầu tiên
	return vowelIndices[0];
  };

  const convertWord = (word) => {
    if (!word) return "";

    const isCapitalized = /^[A-Z]/.test(word);
    let text = word.toLowerCase();

    // 1. Thay các tổ hợp âm đặc biệt (aw, ee, ...)
    for (const [rule, letter] of Object.entries(telexMap)) {
      text = text.replace(new RegExp(rule, "gi"), letter);
    }

    // 2. Kiểm tra ký tự cuối là dấu thanh (s, f, r, x, j)
    let tone = "";
    const lastChar = text.slice(-1);
    if (toneMap[lastChar]) {
      tone = toneMap[lastChar];
      text = text.slice(0, -1);
    }

    // 3. Gắn dấu thanh đúng vị trí
    if (tone) {
      const chars = [...text];
      const pos = chooseTonePosition(chars);
      if (pos !== -1) chars[pos] = chars[pos] + tone;
      text = chars.join("");
    }

    text = text.normalize("NFC");

    // 4. Giữ nguyên kiểu viết hoa đầu từ
    if (isCapitalized) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    return text;
  };

  return input
    .split(/\s+/)
    .map((w) => convertWord(w))
    .join(" ");
};


// === Xử lý buffer, thêm logic viết hoa linh hoạt ===
export const processVietnameseBuffer = (buffer) => {
  if (!buffer) return "";

  let vietnamese = convertTelexToVietnamese(buffer.trim());

  // Viết hoa chữ cái đầu của MỖI từ
  vietnamese = vietnamese
    .split(" ")
    .map((word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : "")
    .join(" ");

  return vietnamese;
};
