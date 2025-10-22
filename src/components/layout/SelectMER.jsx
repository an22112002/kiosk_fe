import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useGlobal } from '../../context/GlobalContext';

export default function SelectMER() {
    const button = ['Bảo hiểm y tế', 'Dịch vụ']
    const navigate = useNavigate()
    const [localLoading, setLocalLoading] = useState(false)
    const { setFlowAsync, resetGlobal } = useGlobal()

    // đặt lại các giá trị state về mặc định (xóa dữ liệu người dùng trước)
    useEffect(() => {
        resetGlobal()
    }, [])

    const handleButtonChange = async (text) => {
        setLocalLoading(true)
        setTimeout(async () => {
            if (text === "Bảo hiểm y tế") {
                await setFlowAsync("insur")
                navigate('/mer/insur/checkPatient')
            } else if (text === "Dịch vụ") {
                await setFlowAsync("non-insur")
                navigate('/mer/non-insur/checkPatient')
            }
            setLocalLoading(false)
        }, 1000)
    }

    return (
        <>
            <Helmet>
                <title>Lựa chọn hình thức khám</title>
            </Helmet>
            {/* modal load */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý, vui lòng chờ</div>
            </Modal>
            <div className={`transition-all duration-300 ${localLoading ? 'blur-sm !bg-white/20' : ''}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1 className="border-4 border-colorOneLighter rounded-2xl px-6 py-4 inline-block bg-white/10 text-colorOne font-bold shadow-md">
                            Lựa chọn hình thức khám
                        </h1>
                    </div>
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
                            {button.map((text, i) => (
                            <div
                                key={i}
                                onClick={() => handleButtonChange(text)}
                                className="w-full flex justify-center"
                            >
                                <div
                                className="flex flex-col items-center justify-center 
                                            w-[80%] min-w-[300px] lg:min-w-[400px]
                                            h-32 bg-gradient-to-r from-colorTwo to-colorFive 
                                            text-white rounded-xl shadow-lg cursor-pointer
                                            hover:from-green-500 hover:to-emerald-600 
                                            hover:scale-105 transition-all duration-500 ease-in-out"
                                >
                                <button className="flex flex-col items-center justify-center gap-2 
                                                    text-[20px] sm:text-[22px] lg:text-[26px] font-semibold">
                                    {text}
                                </button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Nút dưới cùng */}
                <div className="fixed left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] lg:w-[45vw] flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 flex-1 
                                    px-8 py-4 rounded-2xl font-semibold text-white 
                                    text-[16px] sm:text-[20px] lg:text-[24px]
                                    bg-gradient-to-r from-colorBtnBack to-colorOneDark shadow-md
                                    hover:from-colorBtnBack hover:to-colorOneDark hover:scale-105
                                    active:scale-95 transition-all duration-300 ease-in-out"
                        >
                        {<ArrowLeftOutlined />} Trở lại
                    </button>
                </div>
        </>
    )
}