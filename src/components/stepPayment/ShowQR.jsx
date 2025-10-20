import { useGlobal } from "../../context/GlobalContext";
import { QRCodeSVG } from "qrcode.react";
import { getCheckStatusPayment } from "../../api/call_API";
import { openNotification } from "../../utils/helpers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowQR() {
    const navigate = useNavigate()
    const {paymentInfo} = useGlobal()
    const { success, setSuccess } = useState(false)

    const handleCheckPayment = async () => {
        const respone = await getCheckStatusPayment(paymentInfo.THONG_TIN_THANH_TOAN.SO_PHIEU.MA_HO_SO)
        if (respone.code === "000") {
            openNotification("Thông báo", "Thanh toán thành công", "success")
            setSuccess(true)

            navigate("/mer/non-insur/print-bill")
        }
    }

    useEffect(() => {
        // Gọi ngay lần đầu
        handleCheckPayment();

        // Lặp lại mỗi 5 giây
        const interval = setInterval(() => {
            handleCheckPayment();
        }, 5000);

        // Dọn dẹp khi component bị unmount
        return () => clearInterval(interval);
    }, [success])

    return (
        <>
        {paymentInfo?.THONG_TIN_THANH_TOAN?.QR_CODE ? (
				<div className="mt-10 flex flex-col items-center">
					<QRCodeSVG
						value={paymentInfo.THONG_TIN_THANH_TOAN?.QR_CODE}
						level="H"
						size={256}
					/>
					<div className="text-2xl mt-6">
						Xin vui lòng quét mã QR để thanh toán
					</div>
				</div>
			) : null}

			<div className="mt-auto min-h-20 w-full mb-[7px]">
				<div className="flex items-center w-full h-full px-12 gap-10 py-4">
					<button
                    className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                    onClick={handleCheckPayment}
                    >Kiểm tra thanh toán
                    </button>
				</div>
			</div>
        </>
    )
}