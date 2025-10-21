import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal, Spin } from "antd"
import { useGlobal } from "../../context/GlobalContext"
import { LoadingOutlined } from '@ant-design/icons'
import { getClinicServices } from "../../api/call_API"
import RegisterInfo from "./RegisterInfo"
import { splitName, convertDateFormat, openNotification } from "../../utils/helpers";
import { postMedicalRegister } from "../../api/call_API";

export default function ClinicRoom() {
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [clinicRooms, setClinicRooms] = useState([])
    const navigate = useNavigate()
    const { setStateStep, flow, selectedService, setSelectedService, patientInfo, npInfo, setPaymentInfo } = useGlobal()
    const [confirm, setConfirm] = useState(false)
    const [booking, setBooking] = useState(true)
    const [loading, setLoading] = useState(true)

    const dataInfo = patientInfo.personalInfo
    const insuranceInfo = patientInfo.insuranceInfo

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

                const allRooms = [];

                // Duyệt từng tầng: LOAI_KHAM → KHOA → PHONG_KHAM → DICH_VU
                for (const loaiKham of data) {
                    const khoaList = loaiKham?.KHOA || [];
                    for (const khoa of khoaList) {
                        const phongList = khoa?.PHONG_KHAM || [];
                        for (const phong of phongList) {
                            const services = (phong?.DICH_VU || [])
                                .map((dichVu) => {
                                    const price =
                                        flow === "insur"
                                            ? dichVu.DON_GIA_BHYT ?? dichVu.DON_GIA_DICH_VU
                                            : dichVu.DON_GIA_PHONG_KHAM ?? dichVu.DON_GIA_DICH_VU;

                                    return {
                                        code: dichVu.MA_DICH_VU || dichVu.ID_DICH_VU,
                                        label: dichVu.TEN_DICH_VU,
                                        price: price,
                                    };
                                })
                                // Bỏ các dịch vụ không có giá hoặc giá = 0
                                .filter((d) => d.price && d.price > 0);

                            // Thêm phòng khám vào danh sách
                            allRooms.push({
                                code: phong.ID_PHONG_KHAM || phong.MA_PHONG_KHAM,
                                name: phong.TEN_PHONG_KHAM,
                                departmentCode: khoa.ID_KHOA,
                                departmentName: khoa.TEN_KHOA,
                                typeCode: loaiKham.ID_LOAI_KHAM,
                                typeName: loaiKham.TEN_LOAI_KHAM,
                                services,
                            });
                        }
                    }
                }

                // Gộp các phòng khám trùng ID
                const mergedRooms = Object.values(
                    allRooms.reduce((acc, room) => {
                        if (!acc[room.code]) {
                            acc[room.code] = { ...room, services: [...room.services] };
                        } else {
                            // Nếu phòng đã tồn tại → gộp thêm dịch vụ chưa có
                            const existingServiceCodes = acc[room.code].services.map((s) => s.code);
                            const newServices = room.services.filter(
                                (s) => !existingServiceCodes.includes(s.code)
                            );
                            acc[room.code].services.push(...newServices);
                        }
                        return acc;
                    }, {})
                );

                setClinicRooms(mergedRooms);

            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng khám:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicData();
    }, [flow]);

    const handleChooseService = (service) => {
        const option = { 
            name: service.label, // tên dịch vụ
            serviceID: service.code, // mã dịch vụ
            clinic: selectedClinic.name, // tên phòng khám
            price: service.price, // giá dịch vụ
            clinicID: selectedClinic.code, // mã phòng khám
            departmentID: selectedClinic.departmentCode // mã khoa
        }
        setSelectedService(option)
        setSelectedClinic(null)
        setBooking(false)        
    }

    const handleConfirm = async () => {
        if (!selectedService) {
            openNotification("Lỗi", "Bạn chưa chọn dịch vụ nào")
            return
        }
        setConfirm(true)
    }

    const handleRegister = async () => {
        // nếu là khám dịch vụ, bỏ qua
        if (flow !== "insur") {
            return true
        }
        try {
            const { firstName, lastName } = splitName(dataInfo?.personName ?? "");
            const patientData = patientInfo.patientHISInfo != null ? patientInfo.patientHISInfo
                : {
                    HO_BN: lastName,
                    TEN_BN: firstName,
                    HO_TEN: dataInfo?.personName ?? "",
                    DIA_CHI: dataInfo?.residencePlace ?? "",
                    DIEN_THOAI: dataInfo?.phone ? dataInfo.phone : npInfo.phone,
                    GIOI_TINH: dataInfo?.gender ? dataInfo.gender === "Nữ" ? 1 : 2 : 3,
                    MA_BN: "",
                    NGAY_SINH: convertDateFormat(dataInfo?.dateOfBirth ?? ""),
                    SO_GTTT: dataInfo?.idCode ?? "",
                    MA_DANTOC: npInfo?.ethnic ?? "",
                    MA_NGHE_NGHIEP: npInfo?.job ?? "",
                    MA_QUOCTICH: npInfo?.national ?? "",
                    MATINH_CUTRU: npInfo?.province ?? "",
                    MAXA_CU_TRU: npInfo?.commune ?? "",
                };
                patientData["MA_THE_BHYT"] = patientData?.["MA_THE_BHYT"] ?? insuranceInfo?.["MA_THE_BHYT"] ?? "";
                patientData["GT_THE_TU"] = convertDateFormat(patientData?.["GT_THE_TU"] ?? insuranceInfo?.["GT_THE_TU"] ?? "");
                patientData["GT_THE_DEN"] = convertDateFormat(patientData?.["GT_THE_DEN"] ?? insuranceInfo?.["GT_THE_DEN"] ?? "");
                patientData["MA_DKBD"] = patientData?.["MA_DKBD"] ?? insuranceInfo?.["MA_DKBD"] ?? "";
    
                const data = {
                    BN_UU_TIEN: 0,
                    ID_LOAI_KHAM: "01",
                    THONG_TIN_BENH_NHAN: patientData,
                    THONG_TIN_DICH_VU: {
                        ID_KHOA: selectedService?.departmentID,
                        ID_PHONG_KHAM: selectedService?.clinicID,
                        MA_DICH_VU: selectedService?.serviceID
                    },
                };
                const respone = await postMedicalRegister(data);
    
                if (respone.code === "000") {
                    // lưu thông tin gửi về
                    setPaymentInfo(respone.data)
                    return true
                } else {
                    openNotification("Lỗi xảy ra", respone.message);
                    return false
                }
        } catch (error) {
            console.log(error);
            openNotification("Lỗi xử lý", "");
            return false
        }
    };

    const sendRegistration = async () => {
        const result = await handleRegister();
        if (result) {
            openNotification("Thông báo", "Đã đăng ký dịch vụ thành công", "success");
            if (flow === "insur") {
                navigate("/mer/insur/print-bill")
            } else {
                navigate("/mer/non-insur/payment")
            }
        } else {
            openNotification("Lỗi", "Đăng ký dịch vụ thất bại");
        }
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
                    {/* Bảng chọn dịch vụ */}
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

                    {/* Bảng xác thực */}
                    <Modal
                        open={confirm}
                        footer={null}
                        centered
                    >
                        <RegisterInfo patientInfo={patientInfo} npInfo={npInfo} selectedService={selectedService} flow={flow} ></RegisterInfo>
                        <div className="grid grid-cols-2 gap-[20px]">
                            <button
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={() => {setConfirm(false)}}>
                                Hủy bỏ
                            </button>
                            <button
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={sendRegistration}>
                                {(flow === "insur" ? "Bước tiếp theo: In phiếu" : "Bước tiếp theo: Thanh toán")}
                            </button>
                        </div>
                    </Modal>
                </div>

                <div className="flex flex-col justify-center items-center text-[14px] md:text-[16px] lg:text-[18px]">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl">Dịch vụ đã chọn: <span className="italic text-green-600">{selectedService ? `${selectedService.clinic} - ${selectedService.name} - ${selectedService.price} VNĐ` : "Xin chọn dịch vụ"}</span></p>
                    <Spin spinning={loading} indicator={<LoadingOutlined />}>
                        {<div className="grid grid-cols-2 gap-[20px]">
                            <button
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={() => {navigate(-1)}}>
                                Trở lại
                            </button>
                            <button disabled={booking}
                                className="hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleConfirm}>
                                {loading === true ? (<span className="loading-dots">Đang xử lý</span>) : ("Xác thực")}
                            </button>
                        </div>}
                    </Spin>
                </div>
            </div>
        </>
    )
}