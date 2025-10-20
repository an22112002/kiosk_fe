import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import InputForm from "./InputForm"

export default function InsertPatient() {
    const navigate = useNavigate()
    return (
        <>
            <Helmet>
                <title>Thêm thông tin</title>
            </Helmet>
            <div className={`transition-all duration-300}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>Xin vui lòng bổ xung thêm thông tin hồ sơ bệnh viện</h1>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                            <InputForm></InputForm>
                        </div>
                    </div>
                </div>
            </div>
            {/* Nút dưới cùng */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] lg:w-[45vw] flex gap-4">
                <button
                    onClick={() => navigate("/mer")}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                >
                    Trở lại chọn dịch vụ
                </button>

                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                >
                    Tiếp tục
                </button>
            </div>
        </>
    )
}