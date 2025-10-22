import { formatCurrency } from "../../utils/helpers"

export default function RegisterInfo({patientInfo, npInfo, selectedService, flow}) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-center text-green-600">
                Xác thực thông tin
            </h2>
            <div className='flex justify-center'>
                <div className='flex flex-col justify-start gap-2 font-semibold text-gray-700 text-left'>
                    <span>Họ và tên:</span>
                    <span>Ngày sinh:</span>
                    <span>Giới tính:</span>
                    <span>Số điện thoại:</span>
                    <span>Dịch vụ:</span>
                    <span>Đối tượng:</span>
                    <span>Cần thanh toán:</span>
                </div>
                <div className='flex flex-col justify-start gap-2 text-gray-800 text-right'>
                    <div className='flex flex-col justify-start gap-2 text-gray-800 text-right'>
                        <span>{patientInfo?.personalInfo?.data?.personName || "N/A"}</span>
                        <span>{patientInfo?.personalInfo?.data?.dateOfBirth || "N/A"}</span>
                        <span>{patientInfo?.personalInfo?.data?.gender || "N/A"}</span>
                        <span>{patientInfo?.patientHISInfo?.DIEN_THOAI || npInfo.phone || "N/A"}</span>
                        <span>{selectedService?.name || "N/A"}</span>
                        <span>{flow === "insur" ? "Bảo hiểm" : "Dịch vụ"}</span>
                        <span>{formatCurrency(parseInt(selectedService?.price)) || "N/A"}</span>
                    </div>
                </div>
            </div>
            <br></br> 
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">
                Lưu ý: sau khi chuyển sang bước tiếp theo bạn sẽ không thể thay đổi những thông tin này nữa
            </h2>
        </div>
    )
}