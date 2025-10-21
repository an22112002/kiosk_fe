import { useNavigate } from "react-router-dom"
import { useGlobal } from "../../context/GlobalContext"
import { openNotification } from "../../utils/helpers"
import InputForm from "./InputForm"

export default function InsertPatient({ onBack }) {
    const navigate = useNavigate()
    const {npInfo} = useGlobal()

    const checkNewPatientInfo = async () => {
        if (npInfo.ethnic != "" && npInfo.national != "" && npInfo.province != "" && npInfo.commune != "" && npInfo.phone != "") {
            onBack()
        } else {
            console.log("Chưa nhập đủ")
            openNotification("Yều cầu", "Nhập đầy đủ thông tin", "warning")
        }
    }

    return (
        <>
            <div className={`transition-all duration-300}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>Xin vui lòng bổ xung thêm thông tin hồ sơ bệnh viện</h1>
                    </div>
                    <div className='flex justify-center mb-16'>
                        <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                            <InputForm></InputForm>
                        </div>
                    </div>
                </div>
                {/* Nút dưới cùng */}
                <div className="fixed left-1/2 -translate-x-1/2 bottom-8 w-[90%] sm:w-[80%] lg:w-[45vw] flex gap-4 z-50">
                    <button
                        onClick={() => navigate("/mer")}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                                hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                                font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                    >
                        Trở lại chọn dịch vụ
                    </button>

                    <button
                        onClick={checkNewPatientInfo}  // sửa bỏ dấu () nếu bạn đang dùng như vậy
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                                hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                                font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </>
    )
}