import { notification } from "antd";

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