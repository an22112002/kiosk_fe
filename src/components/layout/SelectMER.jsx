import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
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
        }, 5000)
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
                        <h1>Lựa chọn hình thức khám</h1>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex w-full gap-1 sm:w-[80%] lg:w-[45vw]'>
                            {button.map((text, i) => (
                                <div key={i} className='flex m-2 h-full w-1/2' onClick={() => handleButtonChange(text)}>
                                    <div className='flex items-center justify-center h-[80%] w-full bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 hover:scale-105 transition-all duration-500 ease-in-out'>
                                        <button className='cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px] '>{text}</button>
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
                        onClick={() => navigate(-1)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                                hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                                font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                    >
                        Trở lại
                    </button>
                </div>
        </>
    )
}