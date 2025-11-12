import { ExclamationCircleOutlined } from '@ant-design/icons';
import { openWebBHYT, getCookiesWebBHYT } from '../../api/call_API';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Access() {
    const navigate = useNavigate()
    const [countDown, setCountDown] = useState(5)
    const [success, setSuccess] = useState(false)
    const button = ["Truy cập Web BHYT", "Lấy cookies"]

    useEffect(() => {
        if (!success) return;

        if (countDown === 0) {
            navigate("/");
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
        } else {
            const result = await getCookiesWebBHYT()
            if (result) {
                setSuccess(true)
            }
        }
    }

    return (
        <>
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
                <div className="w-[70%] bg-blue-300 my-[50px] py-[25px] rounded-xl">
                    <div className='flex justify-around'>
                        {button.map((text, i) => (
                        <div
                            key={i}
                            onClick={() => handleBtn(text)}
                            className="flex justify-center"
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