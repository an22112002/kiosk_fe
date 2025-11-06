import { useGlobal } from "../../context/GlobalContext";
import { calculateAge, formatCurrency } from "../../utils/helpers";

export default function InfoPrint() {
    const { flow, selectedService, patientInfo, npInfo, paymentInfo, paymentState} = useGlobal()
    // payemntState đang mất
    const dataInfo = patientInfo.personalInfo.data
    const patientHISInfo = patientInfo.patientHISInfo
    const insurInfo = patientInfo.insuranceInfo

	return (
		<div className="w-[600px] mx-auto p-6 text-[1.2rem] font-sans border border-gray-300 rounded-lg">
			<h1 className="text-2xl font-bold text-center mb-6">Thông tin khám bệnh</h1>

			<div className="grid grid-cols-2 gap-y-3">
				<div className="text-left font-medium">Họ tên:</div>
				<div className="text-right">{dataInfo?.personName || "N/A"}</div>

				<div className="text-left font-medium">Giới tính:</div>
				<div className="text-right">{dataInfo?.gender || "N/A"}</div>

				<div className="text-left font-medium">Tuổi:</div>
				<div className="text-right">{dataInfo?.dateOfBirth ? calculateAge(dataInfo?.dateOfBirth) : "N/A"}</div>

				<div className="text-left font-medium">Ngày sinh:</div>
				<div className="text-right">{dataInfo?.dateOfBirth || "N/A"}</div>

				<div className="text-left font-medium">Điện thoại:</div>
				<div className="text-right">{patientHISInfo?.DIEN_THOAI || npInfo.phone || "N/A"}</div>

				<div className="text-left font-medium">Địa chỉ:</div>
				<div className="text-right">{dataInfo?.residencePlace || "N/A"}</div>

				<div className="text-left font-medium">Đối tượng khám bệnh:</div>
				<div className="text-right">{flow === "insur" ? "Bảo hiểm y tế" : "Dịch vụ"}</div>

                { flow === "insur" 
                ? (
                    <>
                     <div className="text-left font-medium">Bảo hiểm y tế:</div>
                    <div className="text-right"> Giá trị từ {insurInfo?.GT_THE_TU || "N/A"} đến {insurInfo?.GT_THE_DEN || "N/A"}</div>

                    <div className="text-left font-medium">Mã thẻ bảo hiểm:</div>
                    <div className="text-right">{insurInfo?.MA_THE_BHYT || "N/A"}</div>
                    </>
                ) 
                : null
                }
			</div>

			{/* Dòng ngăn cách */}
			<hr className="my-4 border-gray-400" />
			<div className="grid grid-cols-2 gap-y-3">
				<div className="text-left font-medium">Dịch vụ:</div>
				<div className="text-right">{selectedService?.name || "N/A"}</div>

				<div className="text-left font-medium">Ngày đăng ký:</div>
				<div className="text-right">{new Date().toLocaleDateString("vi-VN")}</div>

				<div className="text-left font-medium">Đơn giá:</div>
				<div className="text-right">{formatCurrency(parseInt(selectedService?.price)) || "N/A"}</div>
				
				{flow === "non-insur" ? (
					<>
					<div className="text-left font-medium">Thanh toán:</div>
					<div className="text-right">{paymentState || "N/A"}</div>
					</>
				) : null}

				<div className="text-left font-medium">Phòng khám:</div>
				<div className="text-right text-2xl font-bold">{selectedService?.clinic || "N/A"}</div>

				<div className="text-left font-medium">Số thứ tự:</div>
				<div className="text-right text-2xl font-bold">{paymentInfo?.THONG_TIN_TIEP_NHAN.STT_LK || "N/A"}</div>
			</div>
		</div>
	);
}