export default function PatientInfoDisplay({ patientInfo, npInfo, flow }) {
  return (
    <div className="flex justify-center">
      <div className="w-full sm:w-[80%] lg:w-[50vw] border-4 border-blue-500 rounded-xl p-4 inline-block">
        <table className="w-full border-collapse">
          <tbody>
            {/* Hàng 1: Ảnh và 2 cột thông tin */}
            <tr>
              {/* Cột 1: Ảnh */}
              <td rowSpan="7" className="w-[140px] align-top text-center p-2">
                {patientInfo?.faceImage?.data?.img_data ? (
                  <img
                    src={patientInfo.faceImage.data.img_data}
                    alt="Ảnh công dân"
                    className="w-32 h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-32 h-40 border rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    Không có ảnh
                  </div>
                )}
              </td>

              {/* Cột 2 và 3 */}
              <td className="font-semibold text-gray-700 p-2 text-left w-[35%]">
                Họ và tên:
              </td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.personName || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Ngày sinh:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.dateOfBirth || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Giới tính:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.gender || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Quốc tịch:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.nationality || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Quê quán:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.originPlace || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Địa chỉ thường trú:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.personalInfo?.data?.residencePlace || "?"}
              </td>
            </tr>

            <tr>
              <td className="font-semibold text-gray-700 p-2 text-left">Số điện thoại:</td>
              <td className="text-gray-800 p-2 text-right">
                {patientInfo?.patientHISInfo?.DIEN_THOAI || npInfo?.phone || "?"}
              </td>
            </tr>
          </tbody>
        </table>
        {flow === "insur" ? 
        (<div className="w-full">
          <br></br>
          <div><strong>Thông tin bảo hiểm</strong></div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-700 p-2 text-left w-[50%]">Mã thẻ BHYT:</td>
                <td className="text-gray-800 p-2 text-right">
                  {patientInfo?.insuranceInfo?.MA_THE_BHYT || "?"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 p-2 text-left">Thời hạn:</td>
                <td className="text-gray-800 p-2 text-right">
                  {patientInfo?.insuranceInfo?.GT_THE_TU || "?"} - {patientInfo?.insuranceInfo?.GT_THE_DEN || "?"}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 p-2 text-left">Mã nơi đăng ký ban đầu:</td>
                <td className="text-gray-800 p-2 text-right">
                  {patientInfo?.insuranceInfo?.MA_DKBD || "?"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>)
        : null}
      </div>
    </div>
  )
}