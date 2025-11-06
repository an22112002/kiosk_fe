import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { Helmet } from "react-helmet-async"
import { Modal } from "antd"
import { CalendarOutlined, LoadingOutlined } from '@ant-design/icons'
// import { QRCodeSVG } from 'qrcode.react'

export default function HomePage() {
    const [localLoading, setLocalLoading] = useState(false)
    const button = ['ĐĂNG KÝ KHÁM'] //, 'Lấy số', 'Đăng ký mở bảo hiểm', 'Ngân hàng số 24/7', 'Liên thông hồ sơ bệnh án (CCCD/VNEID)', 'Bản đồ', 'Tra cứu']
    const navigate = useNavigate()

    const handleChange = (text) => {
        setLocalLoading(true)
        const delay = [1000, 2000]
        setTimeout(() => {
            if (text === "ĐĂNG KÝ KHÁM") {
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
            <div className="flex flex-col item-center text-center px-7 py-8 rounded-lg w-full h-full">
                <div className="mb-7 font-bold text-[18px] lg:text-[25px] mt-[5%]">
                    <h1 className="text-[1.9rem] border-4 border-colorOneLighter rounded-2xl px-6 py-4 inline-block bg-white/10 text-colorOne font-bold shadow-md">
                        KIOSK THANH TOÁN TỰ ĐỘNG VIỆN PHÍ QUÉT MÃ QR
                    </h1>
                    <div className='mt-4 text-[1.5rem] text-colorOneDark'>
                        PHỤC VỤ KHÁM BẢO HIỂM VÀ KHÁM DỊCH VỤ
                    </div>
                </div>

                <div className="flex flex-col item-center justify-center w-full h-full mt-[5%] p-[5%]">
                    {button.map((text, i) => (
                        <div
                            key={i}
                            onClick={() => handleChange(text)}
                            className="flex justify-center"
                        >
                            <div className="flex flex-col items-center justify-center 
                                            w-full min-w-[250px] lg:min-w-[300px] 
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
                    <div>
                        <img
                        src="/image/guide.png"
                        alt="Hướng dẫn"
                        className="w-2/3 h-1/3 mx-auto mt-[6%]"
                    />
                    </div>
                </div>
            </div>
            </div>
            {/* <div className="grid items-center text-center justify-center w-full h-full text-[20px]">
                <br></br>
                <div>Tên chủ TK: BENH VIEN THAN HA NOI</div>
                <div>Số TK: 8600046636</div>
                <div>Ngân hàng: BIDV - TMCP Đầu tư và Phát triển Việt Nam</div>
                <br></br>
                <div className="flex justify-center items-center">
                <QRCodeSVG
                    value="00020101021138540010A00000072701240006970418011086000466360208QRIBFTTA53037045802VN6304F93A"
                    level="H"
                    size={256}
                />
                </div>
            </div> */}
        </>
    )
}