import { useGlobal } from "../../context/GlobalContext";
import { QRCodeSVG } from "qrcode.react";
import { getCheckStatusPayment } from "../../api/call_API";
import { openNotification } from "../../utils/helpers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";
import { ArrowUpOutlined } from '@ant-design/icons'
import Modal from "antd/es/modal/Modal";

export default function ShowQR() {
    const navigate = useNavigate()
    const {paymentInfo, setPaymentStateAsync, patientInfo, selectedService} = useGlobal()
    const [ countDown, setCountDown ] = useState(6)
    const [ success, setSuccess ] = useState(false)
    const [ openConfirm, setOpenConfirm ] = useState(false)

    console.log(paymentInfo)

    const handleCheckPayment = async () => {
        if (!paymentInfo?.THONG_TIN_THANH_TOAN && !paymentInfo?.THONG_TIN_TIEP_NHAN) {
            openNotification("Lỗi", "Không có thông tin thanh toán")
            return;
        }
        const respone = await getCheckStatusPayment(paymentInfo?.THONG_TIN_THANH_TOAN?.SO_PHIEU, paymentInfo?.THONG_TIN_TIEP_NHAN?.MA_LK)
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
        const respone = await getCheckStatusPayment(paymentInfo?.THONG_TIN_THANH_TOAN?.SO_PHIEU, paymentInfo?.THONG_TIN_TIEP_NHAN?.MA_LK)
        if (respone.data.TRANG_THAI === "Đã thanh toán") {
            await setPaymentStateAsync("Đã thanh toán")
            setSuccess(true)
            setCountDown(5)
        }
    }

    const handleChangePayment = async () => {
        setOpenConfirm(false)
        openNotification("Thông báo", "Đã đổi sang thanh toán tiền mặt", "info")
        await setPaymentStateAsync("Thanh toán tại quầy")
        setSuccess(true)
        setCountDown(5)
    }

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
        <>
        <Modal
            open={openConfirm}
            footer={null}
            closable={false}
            centered
        >
            <div className="flex items-center flex-col gap-2 w-[100%] h-[100%]">
                <div className="w-[100%] m-4 text-center text-[1.2rem]">
                    <strong>BẠN CÓ CHẮC CHẮN MUỐN ĐỔI SANG THANH TOÁN TIỀN MẶT KO?</strong>
                </div>
                <div className="flex justify-around w-[100%]">
                    <button className='w-[40%] text-[25px] p-3 rounded-lg shadow text-white bg-gray-500 hover:bg-gray-400 border border-gray-200 transition-colors duration-200'
                    onClick={() => {setOpenConfirm(false)}}>
                        KHÔNG</button>
                    <button className='w-[40%] text-[25px] p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200'
                    onClick={handleChangePayment}>
                        CÓ</button>
                </div>
            </div>
        </Modal>
        <div className="mt-auto min-h-20 w-full mb-[7px] flex flex-col items-center justify-center px-12 py-4 gap-4">
            <div className='w-[100%] h-[10vh]'></div>
            {paymentInfo?.THONG_TIN_THANH_TOAN?.QR_CODE ? (
                <div className="mt-10 flex flex-col items-center">
                    <div className="border-4 border-colorOneLighter rounded-2xl px-6 py-4 mb-10 inline-block bg-white/10 text-colorOne font-bold shadow-md" >
                        <QRCodeSVG
                            value={paymentInfo?.THONG_TIN_THANH_TOAN?.QR_CODE}
                            level="H"
                            size={300}
                        />
                    </div>
                    <div className="flex flex-col text-center text-[2rem] items-center justify-center">
                        <div className="text-[5rem] animate-bounce">
                            <ArrowUpOutlined></ArrowUpOutlined>
                        </div>
                        <div className="text-colorOneDark" >
                            <strong>Xin vui lòng quét mã QR để thanh toán</strong>
                        </div>
                    </div>
                    <div className="text-[2rem] mt-6 mb-6">
                        Thanh toán cho: <span className="text-gray-500 font-semibold">{patientInfo?.personalInfo?.data?.personName || "N/A"} - {formatCurrency(selectedService?.price) || "N/A"}</span>
                    </div>
                </div>
            ) : (
                <div className="text-[2rem] mt-6 mb-6 text-red-700 text-center">
                    Không hiển thị được QR. Yêu cầu quay lại màn hình chính. ({JSON.stringify(paymentInfo)})
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
                <div className="flex flex-col items-center justify-center w-full min-h-20 mt-[10vh] mb-[7px]">
                    { !success ? 
                        (
                            <>
                                <h1 className="pt-[40px] text-[1.7rem] font-bold mb-4 text-center text-red-600">
                                    LƯU Ý: NẾU BẠN KHÔNG THỂ THANH TOÁN QR, CÓ THỂ ĐỔI SANG THANH TOÁN TIỀN MẶT
                                </h1>
                                <button
                                    className="text-[25px] p-3 bg-gradient-to-r from-colorBtnBack to-colorOneDark text-white rounded-xl hover:from-gray-500 hover:to-gray-600"
                                    onClick={() => {setOpenConfirm(true)}}
                                >
                                    In phiếu thanh toán tiền mặt
                                </button>
                            </>) : null
                    }
                </div>
            )}
        </div>
        </>
    )
}