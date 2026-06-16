import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getClinicServices } from "../../api/call_API"
import { openNotification } from "../../utils/helpers"
import { Input } from "antd"
import { ArrowLeftOutlined } from '@ant-design/icons'

export default function ServicesInfo() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [services, setServices] = useState([])

useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const response = await getClinicServices();
                const data = response?.data || [];

                // Duyệt từng tầng: LOAI_KHAM → KHOA → PHONG_KHAM → DICH_VU
                for (const loaiKham of data) {
                    const khoaList = loaiKham?.KHOA || [];
                    for (const khoa of khoaList) {
                        const phongList = khoa?.PHONG_KHAM || [];
                        for (const phong of phongList) {
                            const services = (phong?.DICH_VU || [])
                                .map((dichVu) => {
                                    return {
                                        code: dichVu.MA_DICH_VU || dichVu.ID_DICH_VU,
                                        clinic: phong.TEN_PHONG_KHAM,
                                        name: dichVu.TEN_DICH_VU,
                                        insurancePrice: dichVu.DON_GIA_BHYT || null,
                                        servicePrice: dichVu.DON_GIA_DICH_VU || null,
                                    };
                                })

                            // Thêm phòng khám vào danh sách
                            setServices((prevServices) => [...prevServices, ...services]);
                        }
                    }
                }

            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng khám:", error);
            }
        };

        fetchClinicData();
    }, []);

    const filteredServices = services.filter(service =>
        service?.name?.toLowerCase()
        ?.includes(searchTerm.toLowerCase())
);
    return (
        <>
            <Helmet>
                <title>Dịch vụ</title>
            </Helmet>
            <div className="flex flex-col items-center gap-10 mt-[5%]">
                <h1 className="text-[2rem] font-bold text-center mb-4">Danh sách dịch vụ</h1>
                <div className="w-[90%] min-w-[300px] lg:min-w-[400px] p-6 px-[20%] bg-white/10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                    <Input
                        placeholder="Tìm kiếm dịch vụ..."
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
                <div className="w-full min-w-[300px] lg:min-w-[400px] max-h-[70vh] overflow-y-auto p-6 px-[10%] bg-white/10 rounded-2xl shadow-lg flex flex-col items-center gap-6">
                    
                    <table className="w-full border-collapse text-center body-font">
                        <thead className="bg-gray-500 border-b-2 border-gray-200">
                            <tr>
                                <th rowSpan={2} className="border px-4 py-2 rounded-tl-lg w-[50%]">Phòng</th>
                                <th rowSpan={2} className="border px-4 py-2 rounded-tl-lg w-[50%]">Tên dịch vụ</th>
                                <th colSpan={2} className="border px-4 py-2 rounded-tr-lg text-center">Giá</th>
                            </tr>
                            <tr>
                                <th className="border px-4 py-2 w-[25%]">Dịch vụ</th>
                                <th className="border px-4 py-2 w-[25%]">Bảo hiểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="border px-4 py-2">{service.clinic}</td>
                                    <td className="border px-4 py-2">{service.name}</td>
                                    <td className="border px-4 py-2">{service?.servicePrice === "" || service?.servicePrice === null || service?.servicePrice === "0" || service?.servicePrice === "0.0" ? "Không có" : `${service?.servicePrice.toLocaleString()} VND`}</td>
                                    <td className="border px-4 py-2">{service?.insurancePrice === "" || service?.insurancePrice === null || service?.insurancePrice === "0" || service?.insurancePrice === "0.0" ? "Không có" : `${service?.insurancePrice.toLocaleString()} VND`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}