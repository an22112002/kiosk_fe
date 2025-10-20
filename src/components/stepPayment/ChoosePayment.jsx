import { useNavigate } from "react-router-dom"
import { useGlobal } from "../../context/GlobalContext"
import { openNotification, splitName, convertDateFormat } from "../../utils/helpers"
import { postMedicalRegister } from "../../api/call_API"

export default function ChoosePayment({ onNext }) {
    const button = ['Tiền mặt', 'Chuyển khoản']
    const info = ['|Thanh toán bằng tiền mặt tại quầy|', '|Chuyển khoản ngân hàng thông qua mã QR|']

    const { flow, selectedService, patientInfo, npInfo, setPaymentInfo } = useGlobal()
    const dataInfo = patientInfo.personalInfo
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
                    MA_DANTOC: npInfo?.ethnic ?? "",
                    MA_NGHE_NGHIEP: npInfo?.job ?? "",
                    MA_QUOCTICH: npInfo?.national ?? "",
                    MATINH_CUTRU: npInfo?.province ?? "",
                    MAXA_CU_TRU: npInfo?.commune ?? "",
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
        const result = await handleRegister()
        if (result) {
            openNotification("Thông báo", "Đã đăng ký dịch vụ thành công", "success");
            if (text === "Tiền mặt") {
                navigate('/mer/non-insur/print-bill')
            } else {
                onNext()
            }
        } else {
            openNotification("Lỗi", "Không đăng ký được dich vụ")
        }
    }

    return (
        <div className='text-center px-7 py-8 rounded-lg'>
            <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                <h1>CHỌN HÌNH THỨC THANH TOÁN</h1>
            </div>
            <div className='flex justify-center'>
                <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                    {button.map((text, i) => (
                        <div key={i} className='flex m-2 h-full w-1/2' onClick={() => handleChange(text)}>
                            <div className='flex flex-col items-center justify-start h-[80%] w-full hover:scale-105 transition-all duration-500 ease-in-out'>
                                <div className='w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600'>
                                    <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]'>{text}</button>
                                </div>
                                <div className="mt-2 text-center text-gray-400">{info[i]}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}