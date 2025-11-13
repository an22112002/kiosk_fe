import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useGlobal } from "../../context/GlobalContext"
import { openNotification, splitName, convertDateFormat } from "../../utils/helpers"
import { postMedicalRegister } from "../../api/call_API"
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Modal from "antd/es/modal/Modal"

export default function ChoosePayment({ onNext }) {
    const button = ['TIỀN MẶT', 'CHUYỂN KHOẢN QR']
    const info = ['|Thanh toán bằng tiền mặt tại quầy|', '|Chuyển khoản ngân hàng thông qua mã QR|']
    const [localLoading, setLocalLoading] = useState(false)

    const { flow, selectedService, patientInfo, npInfo, setPaymentInfo, setPaymentStateAsync } = useGlobal()
    const dataInfo = patientInfo?.personalInfo?.data
    const navigate = useNavigate()

    const handleRegister = async () => {
        // nếu là khám bhyt, bỏ qua
        if (flow === "insur") {
            return true
        }
        try {
            const { firstName, lastName } = splitName(dataInfo?.personName ?? "");
            const patientData = patientInfo.patientHISInfo != null ? patientInfo.patientHISInfo
                : {
                    HO_BN: lastName,
                    TEN_BN: firstName,
                    HO_TEN: dataInfo?.personName ?? "",
                    DIA_CHI: dataInfo?.residencePlace ?? "",
                    DIEN_THOAI: dataInfo?.phone ? dataInfo.phone : npInfo.phone,
                    GIOI_TINH: dataInfo?.gender ? dataInfo.gender === "Nữ" ? 1 : 2 : 3,
                    MA_BN: "",
                    NGAY_SINH: convertDateFormat(dataInfo?.dateOfBirth ?? ""),
                    SO_GTTT: dataInfo?.idCode ?? "",
                    MA_DANTOC: npInfo?.ethnic || "",
                    MA_NGHE_NGHIEP: npInfo?.job || "",
                    MA_QUOCTICH: npInfo?.national || "",
                    MATINH_CUTRU: npInfo?.commune || "",
                    MAXA_CU_TRU: npInfo?.province || "",
                };
        
                const data = {
                    BN_UU_TIEN: 0,
                    ID_LOAI_KHAM: "02",
                    THONG_TIN_BENH_NHAN: patientData,
                    THONG_TIN_DICH_VU: {
                        ID_KHOA: selectedService?.departmentID,
                        ID_PHONG_KHAM: selectedService?.clinicID,
                        MA_DICH_VU: selectedService?.serviceID
                    },
                };

                console.log("post data", data)
                const respone = await postMedicalRegister(data);
    
                if (respone.code === "000") {
                    // lưu thông tin gửi về
                    setPaymentInfo(respone.data)
                    return true
                } else {
                    openNotification("Lỗi xảy ra", respone.message);
                    return false
                }
        } catch (error) {
            console.log(error);
            openNotification("Lỗi xử lý", "");
            return false
        }
    };

    const handleChange = async (text) => {
        setLocalLoading(true)
        const result = await handleRegister()
        setLocalLoading(false)
        if (result) {
            openNotification("Thông báo", "Đã đăng ký dịch vụ thành công", "success");
            if (text === "TIỀN MẶT") {
                await setPaymentStateAsync("Chưa thanh toán")
                navigate('/mer/non-insur/print-bill')
            } else {
                onNext()
            }
        } else {
            openNotification("Lỗi", "Không đăng ký được dịch vụ")
        }
    }

    return (
        <>
            {/* Modal loading */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">
                    Đang xử lý, vui lòng chờ
                </div>
            </Modal>
            <div className='text-center px-7 py-8 rounded-lg'>
                <div className='w-[100%] h-[20vh]'></div>
                <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                    <h1 className="text-[2rem] border-4 border-colorOneLighter rounded-2xl px-6 py-4 mb-10 inline-block bg-white/10 text-colorOne font-bold shadow-md">
                        CHỌN HÌNH THỨC THANH TOÁN
                    </h1>
                </div>
                <div className='flex justify-center mb-[25vh]'>
                    <div className='flex w-full gap-1 justify-around'>
                        {button.map((text, i) => (
                            <div key={i} className='flex m-2 h-full w-[40vw]' onClick={() => handleChange(text)}>
                                <div className='flex flex-col items-center justify-start h-[100%] w-full hover:scale-105 transition-all duration-500 ease-in-out'>
                                    <div className='w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                        <button className='cursor-pointer p-2 text-[20px] sm:text-[25px] font-semibold lg:text-[30px]'>{text}</button>
                                    </div>
                                    <div className="mt-2 text-center text-gray-400 text-[1.3rem]">{info[i]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex justify-center'>
                    <div className='flex w-full gap-1 sm:w-[90%] lg:w-[45vw]'>
                        <div className='w-full bg-gradient-to-r from-colorBtnBack to-colorOneDark text-white rounded-xl hover:from-gray-500 hover:to-gray-600 w-[60%]'
                        onClick={() => navigate("/homepage")}>
                            <button className='cursor-pointer p-2 text-[20px] sm:text-[25px] font-semibold lg:text-[30px]'>
                                <ArrowLeftOutlined /> QUAY LẠI MÀN HÌNH CHÍNH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}