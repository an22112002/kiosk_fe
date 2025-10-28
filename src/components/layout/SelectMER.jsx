import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useGlobal } from '../../context/GlobalContext';

// MER: medical examination register

export default function SelectMER() {
  const button = ['BẢO HIỂM Y TẾ', 'DỊCH VỤ']
  const navigate = useNavigate()
  const [localLoading, setLocalLoading] = useState(false)
  const { setFlowAsync, resetGlobal } = useGlobal()

  useEffect(() => {
    resetGlobal()
  }, [])

  const handleButtonChange = async (text) => {
    setLocalLoading(true)
    setTimeout(async () => {
      if (text === "BẢO HIỂM Y TẾ") {
        await setFlowAsync("insur")
        navigate('/mer/insur/checkPatient')
      } else if (text === "DỊCH VỤ") {
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

      {/* Modal loading */}
      <Modal
        open={localLoading}
        footer={null}
        centered
        styles={{ body: { textAlign: "center" } }}
      >
        <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
        <div className="text-lg font-semibold loading-dots">
          Đang xử lý, vui lòng chờ
        </div>
      </Modal>

      {/* Container chính */}
      <div
        className={`relative flex flex-col items-center justify-center 
                    h-screen overflow-hidden transition-all duration-300 
                    ${localLoading ? "blur-sm !bg-white/20" : ""}`}
      >
        {/* Tiêu đề */}
        <div className="mb-10 text-center">
          <h1 className="border-4 border-colorOneLighter rounded-2xl px-6 py-4 inline-block bg-white/10 text-colorOne font-bold text-[22px] lg:text-[30px] shadow-md">
            LỰA CHỌN HÌNH THỨC KHÁM
          </h1>
        </div>

        {/* Cột các nút */}
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
                <button
                  className="flex flex-col items-center justify-center gap-2 
                             text-[25px] sm:text-[27px] lg:text-[30px] font-semibold"
                >
                  {text}
                </button>
              </div>
            </div>
          ))}

          {/* Nút quay lại */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 
                        w-[80%] min-w-[300px] lg:min-w-[400px]
                        px-8 py-4 rounded-2xl font-semibold text-white 
                        text-[25px] sm:text-[27px] lg:text-[30px]
                        bg-gradient-to-r from-colorBtnBack to-colorOneDark shadow-md
                        hover:from-colorBtnBack hover:to-colorOneDark hover:scale-105
                        active:scale-95 transition-all duration-300 ease-in-out"
          >
            <ArrowLeftOutlined /> QUAY LẠI MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    </>
  )
}
