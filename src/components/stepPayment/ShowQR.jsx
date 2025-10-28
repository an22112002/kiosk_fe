import { useGlobal } from "../../context/GlobalContext";
import { QRCodeSVG } from "qrcode.react";
import { getCheckStatusPayment } from "../../api/call_API";
import { openNotification } from "../../utils/helpers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";

export default function ShowQR() {
    const navigate = useNavigate()
    const {paymentInfo, setPaymentStateAsync, patientInfo, selectedService} = useGlobal()
    const [ countDown, setCountDown ] = useState(6)
    const [ success, setSuccess ] = useState(false)

    const handleCheckPayment = async () => {
        if (!paymentInfo?.THONG_TIN_THANH_TOAN && !paymentInfo?.THONG_TIN_TIEP_NHAN) {
            openNotification("Lỗi", "Không có thông tin thanh toán")
            return;
        }
        const respone = await getCheckStatusPayment(paymentInfo.THONG_TIN_THANH_TOAN.SO_PHIEU, paymentInfo.THONG_TIN_TIEP_NHAN.MA_LK)
        if (respone.data.TRANG_THAI === "Đã thanh toán") {
            openNotification("Thông báo", "Thanh toán thành công", "success")
            await setPaymentStateAsync("Đã thanh toán")
            setSuccess(true)
            setCountDown(5)
        }
    }

    const handleCheckPaymentNoNotification = async () => {
        if (!paymentInfo?.THONG_TIN_THANH_TOAN && !paymentInfo?.THONG_TIN_TIEP_NHAN) {
            return;
        }
        const respone = await getCheckStatusPayment(paymentInfo.THONG_TIN_THANH_TOAN.SO_PHIEU, paymentInfo.THONG_TIN_TIEP_NHAN.MA_LK)
        if (respone.data.TRANG_THAI === "Đã thanh toán") {
            await setPaymentStateAsync("Đã thanh toán")
            setSuccess(true)
            setCountDown(5)
        }
    }

    // const handleChangePayment = async () => {
    //     openNotification("Thông báo", "Đã đổi sang thanh toán tiền mặt", "info")
    //     await setPaymentStateAsync("Thanh toán tại quầy")
    //     setSuccess(true)
    //     setCountDown(5)
    // }

    useEffect(() => {
        if (!success) return;

        if (countDown === 0) {
            navigate("/mer/non-insur/print-bill");
            return;
        }

        const timer = setTimeout(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countDown, success, navigate]);

    useEffect(() => {
        if (!success) {
            // Gọi ngay lần đầu
            handleCheckPayment();

            // Lặp lại mỗi 5 giây
            const interval = setInterval(() => {
                handleCheckPaymentNoNotification();
            }, 5000);

            // Dọn dẹp khi component bị unmount
            return () => clearInterval(interval);
        }
    }, [success, handleCheckPaymentNoNotification])

    return (
        <div className="mt-auto min-h-20 w-full mb-[7px] flex flex-col items-center justify-center px-12 py-4 gap-4">
            {paymentInfo?.THONG_TIN_THANH_TOAN?.QR_CODE && (
                <div className="mt-10 flex flex-col items-center">
                    <QRCodeSVG
                        value={paymentInfo.THONG_TIN_THANH_TOAN?.QR_CODE}
                        level="H"
                        size={256}
                    />
                    <div className="text-2xl mt-6">
                        Xin vui lòng quét mã QR để thanh toán
                    </div>
                    <div className="text-2xl mt-6">
                        Thanh toán cho: <span className="text-gray-500 font-semibold">{patientInfo?.personalInfo?.data?.personName || "N/A"} - {formatCurrency(selectedService?.price) || "N/A"}</span>
                    </div>
                </div>
            )}

            {countDown < 6 ? (
                <div className="flex flex-col items-center justify-center w-full min-h-20 mb-[7px]">
                    <h2 className="text-lg text-gray-700 font-medium">
                        Tự chuyển hướng sau{" "}
                        <span className="text-red-500 font-semibold">{countDown}s</span>
                    </h2>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full min-h-20 mb-[7px]">
                    <button
                        className="text-[25px] p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                        onClick={handleCheckPayment}
                    >
                        Kiểm tra thanh toán
                    </button>
                    {/* <br></br>
                    <br></br>
                    <button
                        className="text-[25px] p-3 bg-gradient-to-r from-colorBtnBack to-colorOneDark text-white rounded-xl hover:from-gray-500 hover:to-gray-600"
                        onClick={handleChangePayment}
                    >
                        Đổi sang thanh toán tiền mặt
                    </button> */}
                </div>
            )}
        </div>
    )
}