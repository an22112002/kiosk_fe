import { formatCurrency } from "../../utils/helpers"

export default function RegisterInfo({patientInfo, npInfo, selectedService, flow}) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-center text-green-600 text-[27px]">
                Xác thực thông tin
            </h2>
            <div className="flex justify-center">
        <table className="text-[25px] font-sans border-collapse">
            <tbody>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Họ và tên:</td>
                <td className="text-gray-800 text-right py-1">
                {patientInfo?.personalInfo?.data?.personName || "N/A"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Ngày sinh:</td>
                <td className="text-gray-800 text-right py-1">
                {patientInfo?.personalInfo?.data?.dateOfBirth || "N/A"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Giới tính:</td>
                <td className="text-gray-800 text-right py-1">
                {patientInfo?.personalInfo?.data?.gender || "N/A"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Số điện thoại:</td>
                <td className="text-gray-800 text-right py-1">
                {patientInfo?.patientHISInfo?.DIEN_THOAI || npInfo.phone || "N/A"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Dịch vụ:</td>
                <td className="text-gray-800 text-right py-1">
                {selectedService?.name || "N/A"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Đối tượng:</td>
                <td className="text-gray-800 text-right py-1">
                {flow === "insur" ? "Bảo hiểm" : "Dịch vụ"}
                </td>
            </tr>
            <tr>
                <td className="font-semibold text-gray-700 text-left pr-4 py-1">Cần thanh toán:</td>
                <td className="text-gray-800 text-right py-1">
                {formatCurrency(parseInt(selectedService?.price)) || "N/A"}
                </td>
            </tr>
            </tbody>
        </table>
        </div>
            <br></br>
            <br></br> 
            <h1 className="text-xl font-bold mb-4 text-center text-red-600">
                Lưu ý: Chuyển sang bước tiếp theo bạn sẽ không thể thay đổi những thông tin này nữa
            </h1>
        </div>
    )
}