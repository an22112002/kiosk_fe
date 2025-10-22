import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { Helmet } from "react-helmet-async"
import { Modal } from "antd"
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons'

export default function HomePage() {
    const [localLoading, setLocalLoading] = useState(false)
    const button = ['Đăng ký khám'] //, 'Lấy số', 'Đăng ký mở bảo hiểm', 'Ngân hàng số 24/7', 'Liên thông hồ sơ bệnh án (CCCD/VNEID)', 'Bản đồ', 'Tra cứu']
    const navigate = useNavigate()

    const handleChange = (text) => {
        setLocalLoading(true)
        const delay = [1000, 2000]
        setTimeout(() => {
            if (text === "Đăng ký khám") {
                navigate('/mer')
            }
            setLocalLoading(false)
        }, delay[Math.floor(Math.random() * delay.length)])
    }

    return (
        <>
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
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
            <div className={`transition-all duration-300 ${
                localLoading ? "blur-sm !bg-white/20" : ""
            }`}
            >
            <div className="text-center px-7 py-8 rounded-lg w-full h-full">
                <div className="mb-7 text-colorOne font-bold text-[18px] lg:text-[25px]">
                <h1 className="border-4 border-colorOneLighter rounded-2xl px-6 py-4 inline-block bg-white/10 text-colorOne font-bold shadow-md">
                    Chào mừng bạn tới KIOSK phục vụ tự động — vui lòng chọn dịch vụ bạn muốn thực hiện!
                </h1>
                </div>

                <div className="flex justify-center w-full h-full">
                {/* 2 cột, giãn nút đều nhau */}
                <div className="grid grid-cols-1 gap-8 w-full max-w-5xl">
                    {button.map((text, i) => (
                    <div
                        key={i}
                        onClick={() => handleChange(text)}
                        className="flex justify-center"
                    >
                        <div className="flex flex-col items-center justify-center 
                                        w-full min-w-[300px] lg:min-w-[400px] 
                                        h-32 bg-gradient-to-r from-colorTwo to-colorFive 
                                        text-white rounded-xl shadow-lg cursor-pointer
                                        hover:from-green-500 hover:to-emerald-600 
                                        hover:scale-105 transition-all duration-500 ease-in-out">
                        <button className="flex flex-col items-center justify-center gap-2 text-[20px] sm:text-[22px] lg:text-[26px] font-semibold">
                            <CalendarOutlined className="text-[28px]" />
                            {text}
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </>
    )
}