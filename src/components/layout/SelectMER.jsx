import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined, QrcodeOutlined, IdcardOutlined } from '@ant-design/icons'
import { useGlobal } from '../../context/GlobalContext';
import MedicalAppointmentForm from '../paperInsert/medicalAppointment'

// MER: medical examination register

export default function SelectMER() {
  const typeRegisterBtn = ['BẢO HIỂM Y TẾ', 'DỊCH VỤ']
  const typePapertBtn = ['GIẤY HẸN KHÁM LẠI', 'GIẤY CHUYỂN BHYT', 'GIẤY KHÁM KẾT QUẢ SUY THẬN GIAI ĐOẠN 3 ĐẾN 5', 'KHÔNG CÓ CÁC LOẠI GIẤY TỜ TRÊN']
  const typeIdentifyBtn = ['QUÉT VNeID', 'QUÉT CCCD']
  const navigate = useNavigate()
  const [localLoading, setLocalLoading] = useState(false)
  const [openTypePaper, setOpenTypePaper] = useState(false)
  const [openTypeIdentifyBtn, setOpenTypeIdentifyBtn] = useState(false)
  const [openNoPaper, setOpenNoPaper] = useState(false)
  const [openInsertForm, setOpenInsertForm] = useState(false)
  const { setFlowAsync, setIdentifyTypeAsync, setPaper, resetGlobal, flow } = useGlobal()

  useEffect(() => {
    resetGlobal()
  }, [])

  const handleButtonChange = async (text) => {
    // Chọn loại dịch vụ
    if (text === "BẢO HIỂM Y TẾ") {
      await setFlowAsync("insur")
      setOpenTypePaper(true)
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
    // Chọn loại giấy tờ
    if (text === "GIẤY HẸN KHÁM LẠI") {
      setOpenTypePaper(false)
      // mở nhập mã giấy khám
      setOpenInsertForm(true)
      return
    }
    if (text === "GIẤY CHUYỂN BHYT") {
      setPaper("Giấy chuyển bảo hiểm y tế")
      setOpenTypePaper(false)
      setOpenTypeIdentifyBtn(true)
      return
    }
    if (text === "GIẤY KHÁM KẾT QUẢ SUY THẬN GIAI ĐOẠN 3 ĐẾN 5") {
      setPaper("Giấy khám kết quả suy thận giai đoạn 3-5")
      setOpenTypePaper(false)
      setOpenTypeIdentifyBtn(true)
      return
    }
    if (text === "KHÔNG CÓ CÁC LOẠI GIẤY TỜ TRÊN") {
      setOpenTypePaper(false)
      setOpenNoPaper(true)
      return
    }
  }

  const handleDoneInsertForm = (s) => {
    setPaper(s)
    setOpenInsertForm(false)
    setOpenTypeIdentifyBtn(true)
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

      {/* Nhập thông tin giấy khám */}
      <Modal
        open={openInsertForm}
        footer={null}
        closable={true}
        onCancel={() => {setOpenInsertForm(false)}}
        centered
        width={1000}
      >
        <MedicalAppointmentForm onBack={ handleDoneInsertForm }></MedicalAppointmentForm>
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

      {/* Giấy tờ có? */}
      <Modal
        open={openTypePaper}
        footer={null}
        centered
        closable={true}
        maskClosable={true}
        onCancel={() => {setOpenTypePaper(false)}}
        width={1000}
      >
          <h1 className='text-[1.5rem] text-blue-700 text-center mt-[10%] mb-[5%]'><strong>BẠN ĐANG CÓ NHỮNG GIẤY TỜ GÌ?</strong></h1>
          <div className='w-[100%] flex flex-col gap-[12px] mb-[5%] items-center justify-around'>
            {typePapertBtn.map((text, i) => {
              return i === 3 ? (
                <button key={i} className='w-[80%] text-[1.4rem] p-3 rounded-lg shadow text-white bg-gradient-to-r from-gray-400 to-gray-500 
                              text-white border-gray-200 transition-colors cursor-pointer
                            hover:from-gray-500 hover:to-gray-600 
                            hover:scale-105 transition-all duration-500 ease-in-out'
                onClick={() => {handleButtonChange(text)}}>
                {text}
                </button>
              ) : (
                <button key={i} className='w-[80%] text-[1.4rem] p-3 rounded-lg shadow text-white bg-gradient-to-r from-colorTwo to-colorFive 
                              text-white border-gray-200 transition-colors cursor-pointer
                            hover:from-green-500 hover:to-emerald-600 
                            hover:scale-105 transition-all duration-500 ease-in-out'
                onClick={() => {handleButtonChange(text)}}>
                {text}
                </button>
              )
            })}
          </div>
      </Modal>

      {/* Báo ko phải người hưởng chính sách bảo hiểm */}
      <Modal
        open={openNoPaper}
        footer={null}
        centered
        closable={false}
        width={1000}
      >
        <h1 className='text-[1.5rem] text-red-700 text-center mt-[10%] mb-[10%]'><strong>XIN LỖI NHƯNG BẠN KHÔNG THUỘC ĐỐI TƯỢNG CÓ THỂ HƯỞNG CHÍNH SÁCH BẢO HIỂM CỦA BỆNH VIỆN. BẠN CHỈ CÓ THỂ CHỌN KHÁM DỊCH VỤ</strong></h1>
        <div className='w-[100%] flex items-center justify-around'>
          <button className='w-[90%] text-[25px] p-3 rounded-lg shadow text-white bg-gradient-to-r from-gray-400 to-gray-500 
                                text-white border-gray-200 transition-colors cursor-pointer
                              hover:from-gray-500 hover:to-gray-600 
                              hover:scale-105 transition-all duration-500 ease-in-out'
            onClick={() => {setOpenNoPaper(false)}}>
            OK
          </button>
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
            onClick={() => navigate("/homepage")}
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
