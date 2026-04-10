import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined, QrcodeOutlined, IdcardOutlined } from '@ant-design/icons'
import { useGlobal } from '../../context/GlobalContext';
import { INSUR_PASS_QR_CODE } from '../../api/config'
// import MedicalAppointmentForm from '../paperInsert/medicalAppointment'

// MER: medical examination register

export default function SelectMER() {
  const typeRegisterBtn = ['BẢO HIỂM Y TẾ', 'DỊCH VỤ']
  const typeIdentifyBtn = ['QUÉT VNeID', 'QUÉT CCCD']
  const navigate = useNavigate()
  const [localLoading, setLocalLoading] = useState(false)
  const [openQRScan, setOpenQRScan] = useState(false)
  const [openTypeIdentifyBtn, setOpenTypeIdentifyBtn] = useState(false)
  const hiddenInputRef = useRef(null);
  const { setFlowAsync, setIdentifyTypeAsync, resetGlobal, flow } = useGlobal()

  useEffect(() => {
    resetGlobal()
  }, [])

  useEffect(() => {
    if (openQRScan) {
      setTimeout(() => {
        hiddenInputRef.current.value = ""
        hiddenInputRef.current?.focus();
      }, 100);
    }
  }, [openQRScan]);

  // nhận tín hiệu clipboard parse
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      console.log("Input value:", e.target.value);
      if (INSUR_PASS_QR_CODE === e.target.value) {
        hiddenInputRef.current?.blur();
        setOpenQRScan(false)
        await setFlowAsync("insur")
        setOpenTypeIdentifyBtn(true)
      }
    }
  };

  const handleButtonChange = async (text) => {
    // Chọn loại dịch vụ
    if (text === "BẢO HIỂM Y TẾ") {
      // await setFlowAsync("insur")
      // setOpenTypeIdentifyBtn(true)
      setOpenQRScan(true)
      return
    }
    if (text === "DỊCH VỤ") {
      await setFlowAsync("non-insur")
      setOpenTypeIdentifyBtn(true)
      return
    }
    // Chọn xác thực
    if (text === "QUÉT VNeID") {
      await setIdentifyTypeAsync("vneid")
      setOpenTypeIdentifyBtn(false)
      goNext()
      return
    }
    if (text === "QUÉT CCCD") {
      await setIdentifyTypeAsync("cccd")
      setOpenTypeIdentifyBtn(false)
      goNext()
      return
    }
  }

  const goNext = async () => {
    if (flow === "insur") {
      goFlowInsur()
    } else {
      goFlowNonInsur()
    }
  }

  const goFlowInsur = async () => {
    setLocalLoading(true)
    setTimeout(async () => {
      navigate('/mer/insur/checkPatient')
      setLocalLoading(false)
    }, 1000)
  }

  const goFlowNonInsur = async () => {
    setLocalLoading(true)
    setTimeout(async () => {
      navigate('/mer/non-insur/checkPatient')
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
        closable={false}
        styles={{ body: { textAlign: "center" } }}
      >
        <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
        <div className="text-lg font-semibold loading-dots">
          Đang xử lý, vui lòng chờ
        </div>
      </Modal>

      {/* Nhân viên kiểm tra giấy tờ */}
      <Modal
        open={openQRScan}
        footer={null}
        closable={true}
        onCancel={() => {hiddenInputRef.current?.blur();hiddenInputRef.current.value = "";setOpenQRScan(false)}}
        styles={{ body: { textAlign: "center" } }}
      >
        <div className='w-[full] bg-yellow-500 text-red-500 text-center mt-5 text-[1.8rem] rounded-lg p-4'>Yêu cầu nhân viên kiểm tra giấy tờ</div>
        <div className='w-[full] text-center mt-4 text-[1.5rem]'><strong>Nếu giấy tờ hợp lệ, vui lòng để nhân viên quét mã QR để tiếp tục</strong></div>
        <input
          type="text"
          ref={hiddenInputRef}
          disabled={!openQRScan}
          style={{ opacity: 0, height: 0 }}
          onKeyDown={handleKeyDown}
        />
      </Modal>

      {/* Xác thực danh tính bằng? */}
      <Modal
        open={openTypeIdentifyBtn}
        footer={null}
        centered
        closable={true}
        maskClosable={true}
        onCancel={() => {setOpenTypeIdentifyBtn(false)}}
        width={1000}
      >
          <h1 className='text-[1.5rem] text-blue-700 text-center mt-[10%] mb-[5%]'><strong>BẠN XÁC THỰC DANH TÍNH BẰNG?</strong></h1>
          <div className='w-[100%] mb-[5%] flex items-center justify-around'>
            {typeIdentifyBtn.map((text, i) => {
              return <button key={i} className='w-[40%] text-[1.5rem] p-3 rounded-lg shadow text-white bg-gradient-to-r from-colorTwo to-colorFive 
                            text-white border-gray-200 transition-colors cursor-pointer
                            hover:from-green-500 hover:to-emerald-600 
                            hover:scale-105 transition-all duration-500 ease-in-out'
              onClick={() => {handleButtonChange(text)}} >
              {i === 0 ? 
              (<><QrcodeOutlined/>{" "+text}</>) : 
              (<><IdcardOutlined/>{" "+text}</>)}
              </button>
            })}
          </div>
      </Modal>

      {/* Container chính */}
      <div
        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-500
              ${localLoading ? "blur-sm !bg-white/20" : ""}`}
      >
        <div className='w-[100%] h-[20vh]'></div>
        {/* Tiêu đề */}
        <div className="mt-10 mb-10 text-center">
          <h1 className="border-4 border-colorOneLighter rounded-2xl px-6 py-4 inline-block bg-white/10 text-colorOne font-bold text-[22px] lg:text-[30px] shadow-md">
            LỰA CHỌN HÌNH THỨC KHÁM
          </h1>
        </div>

        {/* Cột các nút */}
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
          {typeRegisterBtn.map((text, i) => (
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
                        active:scale-95 transition-all duration-500 ease-in-out"
          >
            <ArrowLeftOutlined /> QUAY LẠI MÀN HÌNH CHÍNH
          </button>
        </div>
      </div>
    </>
  )
}
