import { useGlobal } from "../../context/GlobalContext";
import { formatCurrency } from "../../utils/helpers";

export default function InfoPrintCompact() {
  const { flow, selectedService, patientInfo, npInfo, paymentInfo, paymentState } = useGlobal();
  const dataInfo = patientInfo.personalInfo.data;
  const patientHISInfo = patientInfo.patientHISInfo;
  const insurInfo = patientInfo.insuranceInfo;

  return (
    <div className="w-[80mm] mx-auto p-6 text-[16px] font-sans border border-gray-300 rounded-lg leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">Thông tin khám bệnh</h1>

      {/* Thông tin cá nhân */}
      <div className="space-y-2">
        {npInfo === null ? (
          <div><span className="font-bold text[1rem]">Mã bệnh nhân: {patientHISInfo?.MA_BN || "N/A"}</span></div>
        ) : (
          <div><span className="font-bold text-xl">Bệnh nhân mới</span></div>
        )}
        <div>Họ tên: {dataInfo?.personName || "N/A"}</div>
        <div>Giới tính: {dataInfo?.gender || "N/A"}</div>
        <div>Ngày sinh: {dataInfo?.dateOfBirth || "N/A"}</div>
        <div>Điện thoại: {patientHISInfo?.DIEN_THOAI || npInfo?.phone || "N/A"}</div>
        <div>Địa chỉ: {dataInfo?.residencePlace || "N/A"}</div>
        <div>Đối tượng khám: {flow === "insur" ? "Bảo hiểm y tế" : "Dịch vụ"}</div>

        {flow === "insur" && (
          <>
            <div>Bảo hiểm y tế:</div>
            <div>Giá trị từ {insurInfo?.GT_THE_TU || "N/A"} đến {insurInfo?.GT_THE_DEN || "N/A"}</div>
            <div>Mã thẻ bảo hiểm: {insurInfo?.MA_THE_BHYT || "N/A"}</div>
          </>
        )}
      </div>

      <hr className="my-4 border-gray-400" />

      {/* Thông tin khám */}
      <div className="space-y-2">
        <div>Dịch vụ: {selectedService?.name || "N/A"}</div>
        <div>Ngày đăng ký: {new Date().toLocaleDateString("vi-VN")}</div>

        {flow === "non-insur" ? (
          <>
            <div>Đơn giá: {formatCurrency(parseInt(selectedService?.price)) || "N/A"}</div>
            <div>Thanh toán: {paymentState || "N/A"}</div>
          </>
        ) : (
          <div>Bảo hiểm chi trả: {formatCurrency(parseInt(selectedService?.price)) || "N/A"}</div>
        )}

        <div><span className="font-bold text-xl">{selectedService?.clinic || "N/A"}</span></div>
        <div>Số thứ tự: <span className="font-bold text-xl">{paymentInfo?.THONG_TIN_TIEP_NHAN.STT_LK || "N/A"}</span></div>
      </div>
    </div>
  );
}
