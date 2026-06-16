import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import { Input } from "antd"

import { postCheckPayment } from "../../api/call_API";
import { openNotification } from "../../utils/helpers"

export default function CheckPayment() { 
    const navigate = useNavigate()
    const [soPhieu, setSoPhieu] = useState("")
    const [maHoSo, setMaHoSo] = useState("")
    const [soTien, setSoTien] = useState("")
    const [paymentInfo, setPaymentInfo] = useState(null)

    const handleSearch = async () => {
        try {
            setPaymentInfo(null);
            if (!soPhieu || !maHoSo || !soTien) { 
                openNotification("Thiếu thông tin", "Vui lòng nhập đầy đủ số phiếu, mã hồ sơ và số tiền", "warning");
                return;
            }
            const response = await postCheckPayment(soPhieu, soTien, maHoSo);
            if (response.code === "000") {
                setPaymentInfo(response.data);
            } else {
                openNotification("Lỗi", response.message || "Không tìm thấy thông tin thanh toán", "error");
            }
        } catch (error) {
            openNotification("Lỗi", "Có lỗi xảy ra khi tìm kiếm thông tin thanh toán", "error");
        }
    }

    return (
        <>
            <Helmet>
                <title>Lựa chọn hình thức khám</title>
            </Helmet>

            <div className="flex flex-col items-center gap-10 mt-[5%]">
                {/* Form nhập liệu */}
                <div className="w-[80%] min-w-[300px] lg:min-w-[400px] p-6 px-[20%] bg-white/10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                    <h2 className="text-[2rem] font-bold text-center mb-4">Kiểm tra thanh toán</h2>
                    <Input className="text-[1.5rem] text-center" placeholder="Số phiếu" value={soPhieu} onChange={(e) => setSoPhieu(e.target.value)} />
                    <Input className="text-[1.5rem] text-center" placeholder="Mã hồ sơ" value={maHoSo} onChange={(e) => setMaHoSo(e.target.value)} />
                    <Input className="text-[1.5rem] text-center" type="number" placeholder="Số tiền" value={soTien} onChange={(e) => setSoTien(e.target.value)} />

                    <div className="w-[50%] text-[1.5rem] p-3 rounded-lg shadow text-white text-center bg-gradient-to-r from-colorTwo to-colorFive 
                            text-white border-gray-200 transition-colors cursor-pointer
                            hover:from-green-500 hover:to-emerald-600 
                            hover:scale-105 transition-all duration-500 ease-in-out" onClick={() => {handleSearch()}}>
                        <SearchOutlined />
                        <span className="text-[1.2rem]">&nbsp;Tìm kiếm</span>
                    </div>
                </div>

                { paymentInfo != null ? (
                    <div className="w-[80%] min-w-[300px] lg:min-w-[400px] p-6 px-[20%] bg-white/10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="font-semibold text-gray-700 p-2 text-left w-[50%]">Số phiếu:</td>
                                <td className="text-gray-800 p-2 text-right">
                                    {paymentInfo?.SO_PHIEU ||"?"}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-gray-700 p-2 text-left w-[50%]">Trạng thái:</td>
                                <td className="text-gray-800 p-2 text-right">
                                    {paymentInfo?.TRANG_THAI_THANH_TOAN ||"?"}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-gray-700 p-2 text-left w-[50%]">Thời điểm thanh toán:</td>
                                <td className="text-gray-800 p-2 text-right">
                                    {paymentInfo?.NGAY_THANH_TOAN ||"NaN"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ) : null }
                

                {/* Nút quay lại */}
                <button
                    onClick={() => {setPaymentInfo(null);navigate(-1)}}
                    className="flex items-center justify-center gap-2 
                                w-[80%] min-w-[300px] lg:min-w-[400px]
                                px-8 py-4 rounded-2xl font-semibold text-white 
                                text-[25px] sm:text-[27px] lg:text-[30px]
                                bg-gradient-to-r from-colorBtnBack to-colorOneDark shadow-md
                                hover:from-colorBtnBack hover:to-colorOneDark hover:scale-105
                                active:scale-95 transition-all duration-500 ease-in-out"
                >
                    <ArrowLeftOutlined /> QUAY LẠI MÀN HÌNH CHÍNH
                </button>
            </div>
        </>
    );
}
