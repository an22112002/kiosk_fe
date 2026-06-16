import {getMedicalRoomInfo} from "../../api/call_API";
import { useState, useEffect } from "react"
import { openNotification } from "../../utils/helpers"
import { Helmet } from "react-helmet-async"
import { Input } from "antd"
import { useNavigate } from "react-router-dom"
import { ArrowLeftOutlined } from '@ant-design/icons'

export default function ClinicInfo() {
    const navigate = useNavigate()
    const [clinicInfo, setClinicInfo] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const fetchClinicInfo = async () => {
        try {
            const response = await getMedicalRoomInfo();
            if (response.code === "000") {
                setClinicInfo(response.data);
            } else {
                openNotification("Lỗi", response.message || "Không thể tải thông tin phòng khám", "error");
            }
        } catch (error) {
            openNotification("Lỗi", "Có lỗi xảy ra khi tải thông tin phòng khám", "error");
        }
    }

    const filteredClinicInfo = clinicInfo.filter(info =>
        info?.TEN_PHONG_KHAM?.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // Tải thông tin phòng khám khi component được mount và lặp sau mỗi 10 giây
        fetchClinicInfo();

        const interval = setInterval(() => {
            fetchClinicInfo();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Helmet>
                <title>Thông tin phòng khám</title>
            </Helmet>
            <div className="flex flex-col items-center gap-10 mt-[2%]">
                <h1 className="text-[2rem] font-bold text-center mb-4">Thông tin phòng khám</h1>
                <div className="w-[90%] min-w-[300px] lg:min-w-[400px] p-6 px-[20%] bg-white/10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                    <Input
                        placeholder="Tìm kiếm phòng khám..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-4 text-[1.5rem] text-left"
                    />
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 
                                    w-full min-w-[300px] lg:min-w-[400px]
                                    px-8 py-4 rounded-2xl font-semibold text-white 
                                    text-[25px] sm:text-[27px] lg:text-[30px]
                                    bg-gradient-to-r from-colorBtnBack to-colorOneDark shadow-md
                                    hover:from-colorBtnBack hover:to-colorOneDark hover:scale-105
                                    active:scale-95 transition-all duration-500 ease-in-out"
                    >
                        <ArrowLeftOutlined /> QUAY LẠI MÀN HÌNH CHÍNH
                    </button>
                </div>
                <div className="w-[90%] min-w-[300px] lg:min-w-[400px] max-h-[70vh] overflow-y-auto p-6 px-[20%] bg-white/10 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredClinicInfo.map((info, index) => (
                        <div key={index} className="w-full p-4 bg-gradient-to-r from-colorTwo to-colorFive rounded-lg shadow-md flex flex-col justify-between gap-3">
                            <h2 className="text-[1.5rem] font-semibold mb-2">{info?.TEN_PHONG_KHAM}</h2>
                            <div>
                                <p className="flex flex-row gap-2 text-center items-center"><span className="font-semibold">Số thứ tự hiện tại:</span> <div className="text-[1.25rem] text-red-500 font-bold">{info?.STT_HIEN_TAI}</div></p>
                                <p className="flex flex-row gap-2 text-center items-center"><span className="font-semibold">Số bệnh nhân đang chờ:</span> <div className="text-[1.25rem] text-purple-500 font-bold">{info?.SO_CHO_KHAM}</div></p>
                                <p className="flex flex-row gap-2 text-center items-center"><span className="font-semibold">Tổng số khám hôm nay:</span> <div className="text-[1.25rem] text-blue-500 font-bold">{info?.TONG_SO_KHAM_HOM_NAY}</div></p>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}