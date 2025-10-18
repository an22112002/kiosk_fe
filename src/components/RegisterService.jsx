import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Spin } from "antd"
import { useGlobal } from "../context/GlobalContext"
import { LoadingOutlined } from '@ant-design/icons'
import { getClinicServices } from "../api/call_API"

function ClinicRoom() {
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [clinicRooms, setClinicRooms] = useState([])
    const navigate = useNavigate()
    const { setStateStep, flow, selectedService, setSelectedService } = useGlobal()
    const [booking, setBooking] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // bước 2
        setStateStep(2)
    }, [setStateStep])

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                setLoading(true);
                const response = await getClinicServices();
                const data = response?.data || [];

                // Gộp toàn bộ các phòng khám từ nhiều loại khám, nhiều khoa
                const allRooms = data.flatMap((loaiKham) =>
                    (loaiKham.KHOA || []).flatMap((khoa) =>
                        (khoa.PHONG_KHAM || []).map((phong) => ({
                            code: phong.ID_PHONG_KHAM || phong.MA_PHONG_KHAM,
                            name: phong.TEN_PHONG_KHAM,
                            services: (phong.DICH_VU || []).map((dichVu) => ({
                                code: dichVu.MA_DICH_VU,
                                label: dichVu.TEN_DICH_VU,
                                price:
                                    flow === "insur"
                                        ? dichVu.DON_GIA_BHYT
                                        : dichVu.DON_GIA_PHONG_KHAM,
                            })),
                        }))
                    )
                );

                // Gộp các phòng khám trùng ID => 1 phòng duy nhất
                const mergedRooms = Object.values(
                    allRooms.reduce((acc, room) => {
                        if (!acc[room.code]) {
                            acc[room.code] = { ...room, services: [...room.services] };
                        } else {
                            // Nếu phòng đã tồn tại thì gộp thêm các dịch vụ chưa có
                            const existingServices = acc[room.code].services.map((s) => s.code);
                            const newServices = room.services.filter(
                                (s) => !existingServices.includes(s.code)
                            );
                            acc[room.code].services.push(...newServices);
                        }
                        return acc;
                    }, {})
                );

                // Sắp xếp hoặc giới hạn số lượng nếu cần
                const finalRooms = mergedRooms.slice(0, 5);

                setClinicRooms(finalRooms);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng khám:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicData();
    }, [flow]);



    const handleChooseService = (service) => {
        const option = { name: service.label, clinic: selectedClinic.name, price: service.price }
        setSelectedService(option)
        setSelectedClinic(null)
        setBooking(false)        
    }

    const handleRegister = async () => {
        if (!selectedService) {
            alert("Vui lòng chọn dịch vụ.")
            return
        }
        console.log("Chưa có thanh toán")
        // const payload = {
        //     service_name: selectedService.name,
        //     type: flowType,
        // }
        // const citizen_id = insurance_check_data?.citizen_id || patient_exit_data?.patient_id || patient_register_initial?.patient_id

    }

    const handleBack = async () => {
        navigate(-1)
    }

    return (
        <>
            {/* Hiện thông báo */}
            <div className="flex flex-col justify-center items-center bg-white p-2 md:p-6 rounded-xl">
                <div className="text-[14px] md:text-[16px] lg:text-[18px] flex flex-col lg:flex-row w-[90vw] lg:w-[60vw] md:w-[70vw] sm:w-[80vw] gap-3 justify-center items-center">
                    
                    <div className="grid grid-cols-2 gap-[20px]">
                        {clinicRooms.map((clinic) => (
                            <button
                            key={clinic.name}
                            className="p-4 rounded-2xl shadow bg-gradient-to-r text-center from-green-400 to-emerald-500 
                                        text-white hover:scale-105 duration-500 transition-all"
                            onClick={() => setSelectedClinic(clinic)}
                            >
                            <h2 className="text-lg font-bold">{clinic.name}</h2>
                            </button>
                        ))}
                    </div>
                    <Modal
                        open={!!selectedClinic}
                        onCancel={() => setSelectedClinic(null)}
                        footer={null}
                        centered
                    >
                        {selectedClinic && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-center text-green-600">
                                {selectedClinic.name}
                            </h2>
                            <div className="grid grid-cols-2 gap-[20px]">
                            {selectedClinic.services.map((service, idx) => (
                                <button
                                key={idx}
                                className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                                onClick={() => handleChooseService(service)}
                                >
                                <div className="font-semibold">{service.label}</div>
                                </button>
                            ))}
                            </div>
                        </div>
                        )}
                    </Modal>
                </div>

                <div className="flex flex-col justify-center items-center text-[14px] md:text-[16px] lg:text-[18px]">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedService ? `${selectedService.clinic} - ${selectedService.name} - ${selectedService.price} VNĐ` : "Xin chọn dịch vụ"}</span></p>
                    <Spin spinning={loading} indicator={<LoadingOutlined />}>
                        {<div className="grid grid-cols-2 gap-[20px]">
                            <button
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleBack}>
                                Trở lại
                            </button>
                            <button disabled={booking}
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleRegister}>
                                {loading === true ? (<span className="loading-dots">Đang xử lý</span>) : (flow === "insur" ? "Bước tiếp theo: In phiếu" : "Bước tiếp theo: Thanh toán")}
                            </button>
                        </div>}
                    </Spin>
                </div>
            </div>
        </>
    )
}

export default ClinicRoom