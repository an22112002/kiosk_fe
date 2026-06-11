import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined, QrcodeOutlined, IdcardOutlined } from '@ant-design/icons'
import { useGlobal } from '../../context/GlobalContext';
import { openNotification } from '../../utils/helpers'
// import { INSUR_PASS_QR_CODE } from '../../api/config'
// import MedicalAppointmentForm from '../paperInsert/medicalAppointment'

// MER: medical examination register

export default function SelectMER() {
  const typeRegisterBtn = ['BẢO HIỂM Y TẾ', 'DỊCH VỤ']
  const typeIdentifyBtn = ['QUÉT VNeID', 'QUÉT CCCD']
  const navigate = useNavigate()
  const [localLoading, setLocalLoading] = useState(false)
  const [openPaperType, setOpenPaperType] = useState(false)
  const [openTypeIdentifyBtn, setOpenTypeIdentifyBtn] = useState(false)
  const { setFlowAsync, setIdentifyTypeAsync, resetGlobal, flow, setInsurPaper } = useGlobal()

  const [paperType, setPaperType] = useState("")

  const [paperNumber, setPaperNumber] = useState("")
  const [diseaseCode, setDiseaseCode] = useState("")
  const [from, setFrom] = useState("")

  useEffect(() => {
    resetGlobal()
  }, [])

  const handleButtonChange = async (text) => {
    // Chọn loại dịch vụ
    if (text === "BẢO HIỂM Y TẾ") {
      await setFlowAsync("insur")
      // setOpenTypeIdentifyBtn(true)
      setOpenPaperType(true)
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

      {/* chọn loại giấy tờ */}
      <Modal
        open={openPaperType}
        footer={null}
        closable={true}
        onCancel={() => {setOpenPaperType(false)}}
        styles={{ body: { textAlign: "center" } }}
      >
        <h1 className='text-[1.5rem] text-blue-700 text-center mt-[10%] mb-[5%]'><strong>GIẤY TỜ XÁC THỰC?</strong></h1>
        {paperType === "" && (
          <div className='w-[100%] mb-[5%] flex items-center justify-around'>
            <button className='w-[80%] text-[1.5rem] p-3 rounded-lg shadow text-white bg-gradient-to-r from-colorTwo to-colorFive 
                              text-white border-gray-200 transition-colors cursor-pointer
                              hover:from-green-500 hover:to-emerald-600 
                              hover:scale-105 transition-all duration-500 ease-in-out'
              onClick={() => {
                setPaperNumber("")
                setDiseaseCode("")
                setFrom("")
                setPaperType("insurMovingPaper")
              }} >
              GIẤY CHUYỂN TUYẾN
            </button>
          </div>
        )}
        {paperType === "insurMovingPaper" && (
          <div className='w-[100%] mb-[5%] flex flex-col items-center justify-around'>
            <div className='grid grid-cols-2 gap-3'>
              <label className='text-left text-[1.2rem] text-gray-500'>Số giấy chuyển tuyến</label>
              <input className='p-2 rounded-lg text-[1.2rem] border w-full' value={paperNumber} onChange={(e) => setPaperNumber(e.target.value)} />
              <label className='text-left text-[1.2rem] text-gray-500'>Mã bệnh chuyển tuyến</label>
              <input className='p-2 rounded-lg text-[1.2rem] border w-full' value={diseaseCode} onChange={(e) => setDiseaseCode(e.target.value)} />
              <label className='text-left text-[1.2rem] text-gray-500'>Đơn vị chuyển tuyến</label>
              <input className='p-2 rounded-lg text-[1.2rem] border w-full' value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className='flex flex-col items-start gap-3 w-full'>
              <button className='w-full mt-3 text-[1.5rem] p-3 rounded-lg shadow text-white bg-gradient-to-r from-colorTwo to-colorFive 
                              text-white border-gray-200 transition-colors cursor-pointer
                              hover:from-green-500 hover:to-emerald-600
                              hover:scale-105 transition-all duration-500 ease-in-out'
                onClick={() => {
                  if (paperNumber === "" || diseaseCode === "" || from === "") {
                    openNotification("Lỗi", "Vui lòng điền đầy đủ thông tin giấy chuyển tuyến")
                    return
                  }
                  setInsurPaper({
                    type: "GIẤY CHUYỂN TUYẾN",
                    paperNumber,
                    diseaseCode,
                    from
                  })
                  setPaperType("")
                  setOpenPaperType(false)
                  setOpenTypeIdentifyBtn(true)
                }} >
                XÁC NHẬN
              </button>
            </div>
          </div>
        )}
        
      </Modal>

      {/* Xác thực danh tính bằng? */}
      <Modal
        open={openTypeIdentifyBtn}
        footer={null}
        centered
        closable={true}
        maskClosable={true}
        onCancel={() => {
          setOpenTypeIdentifyBtn(false)
          setPaperType("")
          setInsurPaper(null)
        }}
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
