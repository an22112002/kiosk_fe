import { useNavigate } from "react-router-dom"
import { useGlobal } from "../../context/GlobalContext"
import { openNotification } from "../../utils/helpers"
import InputForm from "./InputForm"

export default function InsertPatient({ onBack }) {
    const navigate = useNavigate()
    const {npInfo} = useGlobal()

    const checkNewPatientInfo = async () => {
        if (npInfo.ethnic !== "" && npInfo.national !== "" && npInfo.province !== "" && npInfo.commune !== "" && npInfo.phone !== "" && npInfo.phone.length === 10) {
            onBack()
        } else {
            console.log("Chưa nhập đủ")
            openNotification("Yều cầu", "Nhập đầy đủ thông tin", "warning")
        }
    }

    return (
        <>
            <div className="transition-all duration-300">
                {/* Tiêu đề */}
                <div className="px-7 py-4">
                    <h1 className="mb-5 text-colorOne font-bold text-[20px] lg:text-[26px]">
                        Xin vui lòng bổ sung thêm thông tin hồ sơ bệnh viện
                    </h1>
                </div>

                {/* Form */}
                <div className="flex justify-center mb-10">
                    <div className="flex w-full gap-2 sm:w-[80%] lg:w-[45vw]">
                        <InputForm />
                    </div>
                </div>

                {/* Nhóm nút hành động */}
                <div className="flex justify-center gap-6 mt-8 w-full max-w-[700px] mx-auto">
                    <button
                        onClick={() => navigate("/mer")}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 
                                text-white rounded-xl hover:from-gray-500 hover:to-gray-700 
                                transition-all duration-300 font-semibold 
                                text-[16px] sm:text-[18px] lg:text-[22px]"
                    >
                        Trở lại chọn dịch vụ
                    </button>

                    <button
                        onClick={checkNewPatientInfo}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-colorTwo to-colorFive 
                                text-white rounded-xl hover:from-green-500 hover:to-emerald-600 
                                transition-all duration-300 font-semibold 
                                text-[16px] sm:text-[18px] lg:text-[22px]"
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </>
    )
}