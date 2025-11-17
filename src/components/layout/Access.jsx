import { ExclamationCircleOutlined } from '@ant-design/icons';
import { openWebBHYT, getCookiesWebBHYT, getUserPIS, saveUserPIS } from '../../api/call_API';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from 'antd/es/modal/Modal';
import Input from 'antd/es/input/Input';

export default function Access() {
    const navigate = useNavigate()
    const [countDown, setCountDown] = useState(5)
    const [openSetUser, setOpenSetUser] = useState(false)
    const [success, setSuccess] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const button = ["Thông tin đăng nhập", "Truy cập Web BHYT", "Lấy cookies"]

    useEffect(() => {
        if (!success) return;

        if (countDown === 0) {
            navigate("/homepage");
            return;
        }

        const timer = setTimeout(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countDown, success, navigate]);

    const handleBtn = async (text) => {
        if (text === "Truy cập Web BHYT") {
            await openWebBHYT()
            return
        } 
        if (text === "Thông tin đăng nhập") {
            setOpenSetUser(true)
            const data = await getUserPIS()
            setUsername(data.username)
            setPassword(data.password)
            return
        }
        if (text === "Lưu") {
            await saveUserPIS(username, password)
            setOpenSetUser(false)
            return
        } 
        if (text === "Lấy cookies") {
            const result = await getCookiesWebBHYT()
            if (result) {
                setSuccess(true)
            }
            return
        }
    }

    return (
        <>
            <Modal
                open={openSetUser}
                footer={null}
                closable={true}
                centered
                onCancel={() => {setOpenSetUser(false)}}
            >
                <div className='w-[100%] gap-[10px] flex flex-col text-[1.5rem]' >
                    <h1 className='text-[1.5rem] text-blue-700 text-center mt-[10%] mb-[5%]'><strong>Tài khoản dùng đăng nhập PIS</strong></h1>
                    <div className='mt-10px'>Tài khoản</div>
                    <Input.Password value={username} onChange={(e) => setUsername(e.target.value)} style={{ fontSize: "1.5rem" }}></Input.Password>
                    <div className='mt-10px'>Mật khẩu</div>
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} style={{ fontSize: "1.5rem" }} iconRender={() => null}></Input.Password>
                    <div
                        onClick={() => handleBtn("Lưu")}
                        className="flex justify-center"
                    >
                        <div className="flex flex-col items-center justify-center 
                                            w-full bg-emerald-500 text-white rounded-xl shadow-lg cursor-pointer
                                            hover:from-green-600 hover:to-emerald-700 
                                            hover:scale-105 transition-all duration-500 ease-in-out">
                        <button className="flex flex-col items-center justify-center gap-2 text-[20px] sm:text-[22px] lg:text-[26px] font-semibold">
                            Lưu
                        </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="w-100% h-20px text-center text-[1.5rem] text-red-700 bg-yellow-200 p-[30px] mt-[20px] mb-[10vh]">
                <strong>
                    <ExclamationCircleOutlined></ExclamationCircleOutlined> Trang này chỉ xuất hiện khi khởi động ứng dụng kiosk và sẽ không xuất hiện lại trong quá trình sử dụng
                </strong>
            </div>
            <div className="flex flex-col gap-[10px] items-center justify-center text-[1.5rem]">
                <div className="w-[80%] bg-gray-500 flex flex-col gap-[10px] rounded-xl px-[2.4rem] py-[3rem]">
                    <span><strong className='text-[1.7rem]'>Bước 1:</strong> Bấm <strong className='text-[1.6rem] text-emerald-500'>"Truy cập Web BHYT"</strong></span>
                    <span><strong className='text-[1.7rem]'>Bước 2:</strong> Thực hiện quá trình đăng nhập và vào trang "<i className='text-[1.2rem]'>https://gdbhyt.baohiemxahoi.gov.vn/ThongTuyenLSKCB</i>"</span>
                    <span><strong className='text-[1.7rem]'>Bước 3:</strong> Thu nhỏ trang BHYT (không đóng), rồi quay lại trang này và bấm <strong className='text-[1.6rem] text-emerald-500'>"Lấy cookies"</strong></span>
                    <span><strong className='text-[1.7rem]'>Bước 4:</strong> Trở lại trang chủ</span>
                </div>
                <div className="w-[85%] bg-blue-300 my-[50px] py-[25px] rounded-xl">
                    <div className='flex justify-around'>
                        {button.map((text, i) => (
                        <div
                            key={i}
                            onClick={() => handleBtn(text)}
                            className="flex justify-center w-[20%]"
                        >
                            <div className="flex flex-col items-center justify-center 
                                            w-full min-w-[250px] lg:min-w-[300px] bg-emerald-500
                                            h-32 text-white rounded-xl shadow-lg cursor-pointer
                                            hover:from-green-600 hover:to-emerald-700 
                                            hover:scale-105 transition-all duration-500 ease-in-out">
                            <button className="flex flex-col items-center justify-center gap-2 text-[20px] sm:text-[22px] lg:text-[26px] font-semibold">
                                {text}
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                {countDown < 5 ?
                    <h2 className="text-lg text-gray-700 font-medium">
                        Tự chuyển hướng sau{" "}
                        <span className="text-[25px] text-red-500 font-semibold">{countDown}s</span>
                    </h2>
                    : null
                }
                <h1 className="text-red-500 text-[2rem] text-center">
                    <strong>
                        Lưu ý: Sau khi lấy được cookies thì không dùng tài khoản PIS đang đăng nhập để đăng nhập lại trên bất kỳ máy nào khác cho đến khi tắt ứng dụng kiosk
                    </strong>
                </h1>
            </div>
        </>
    )
}