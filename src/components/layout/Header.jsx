import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Modal from 'antd/es/modal/Modal'

export default function Header() {
    const [ goBack, setGoBack ] = useState(false)
    const navigate = useNavigate()

    const chooseBackHomepage = () => {
        setGoBack(true)
    }

    const handleBackHomepage = () => {
        setGoBack(false)
        navigate("/")
    }

    return (
        <>
        <Modal
            open={goBack}
            footer={null}
            closable={false}
            centered
        >
            <h1 className='text-[1.5rem] text-center mt-[10%] mb-[10%]'><strong>Bạn có chắc muốn quay lại trang chủ?</strong></h1>
            <div className='w-[100%] flex items-center justify-around'>
                <button className='w-[30%] text-[25px] p-3 rounded-lg shadow text-white bg-gray-500 hover:bg-gray-400 border border-gray-200 transition-colors duration-200'
                onClick={() => {setGoBack(false)}} >
                    HỦY
                </button>
                <button className='w-[30%] text-[25px] p-3 rounded-lg shadow text-white bg-red-500 hover:bg-red-400 border border-gray-200 transition-colors duration-200'
                onClick={handleBackHomepage} >
                    QUAY LẠI
                </button>
            </div>
        </Modal>
        <div className='fixed top-0 flex p-4 w-full bg-colorOne z-[1000] items-center justify-between'>
            <div className='h-[100%] w-[7vw] text-white text-[31px]'><HomeOutlined className='h-[100%]' onClick={chooseBackHomepage}></HomeOutlined></div>
            <h1 className='text-center text-white font-extrabold sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[28px] 2xl:text-[31px] '>BỆNH VIỆN THẬN HÀ NỘI</h1>
            <div className='h-[100%] w-[7vw] text-white text-[31px]'></div>
        </div>
        </>
    )
}