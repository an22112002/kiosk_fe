import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "antd"
import { useGlobal } from "../../context/GlobalContext"

import { getClinicServices } from "../../api/call_API"
import { Helmet } from "react-helmet-async"
import RegisterInfo from "./RegisterInfo"
import { splitName, convertDateFormat, openNotification } from "../../utils/helpers";
import { postMedicalRegister } from "../../api/call_API";
import { LoadingOutlined } from '@ant-design/icons'

export default function ClinicRoom() {
    const [localLoading, setLocalLoading] = useState(false)
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [clinicRooms, setClinicRooms] = useState([])
    const navigate = useNavigate()
    const { setStateStep, flow, selectedService, setSelectedService, patientInfo, npInfo, setPaymentInfo } = useGlobal()
    const [confirm, setConfirm] = useState(false)
    const [booking, setBooking] = useState(true)
    const [loading, setLoading] = useState(true)

    const dataInfo = patientInfo.personalInfo.data
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
                    NGAY_SINH: convertDateFormat(dataInfo?.dateOfBirth),
                    SO_GTTT: dataInfo?.idCode ?? "",
                    MA_DANTOC: npInfo?.ethnic || "",
                    MA_NGHE_NGHIEP: npInfo?.job || "",
                    MA_QUOCTICH: npInfo?.national || "",
                    MATINH_CUTRU: npInfo?.commune || "",
                    MAXA_CU_TRU: npInfo?.province || "",
                };
                patientData["MA_THE_BHYT"] = insuranceInfo?.["MA_THE_BHYT"];
                patientData["GT_THE_TU"] = convertDateFormat(insuranceInfo?.["GT_THE_TU"]);
                patientData["GT_THE_DEN"] = convertDateFormat(insuranceInfo?.["GT_THE_DEN"]);
                patientData["MA_DKBD"] = insuranceInfo?.["MA_DKBD"];
    
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
                console.log("post data", data)
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
            return false
        }
    };

    const sendRegistration = async () => {
        setLocalLoading(true)
        const result = await handleRegister();
        setLocalLoading(false)
        if (result) {
            if (flow === "insur") {
                openNotification("Thông báo", "Đã đăng ký dịch vụ thành công", "success");
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
            <Helmet>
                <title>Chọn dịch vụ</title>
            </Helmet>
            {/* Modal loading */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">
                    Đang xử lý, vui lòng chờ
                </div>
            </Modal>
            {/* Hiện thông báo */}
            <div className="overflow-y-auto flex flex-col justify-center items-center bg-white p-2 md:p-6 rounded-xl">
                <div className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl text-[28px]">XIN CHỌN PHÒNG KHÁM</div>
                <div className="text-[28px] md:text-[25px] lg:text-[30px] flex flex-col lg:flex-row w-[90vw] lg:w-[60vw] md:w-[70vw] sm:w-[80vw] gap-3 justify-center items-center">
                    <div className="grid grid-cols-2 gap-[20px]">
                        {clinicRooms.map((clinic) => (
                            <button
                            key={clinic.name}
                            className="p-4 rounded-2xl shadow bg-gradient-to-r text-center from-green-400 to-emerald-500 
                                        text-white hover:scale-105 duration-500 transition-all"
                            onClick={() => setSelectedClinic(clinic)}
                            >
                            <div className="font-bold">{clinic.name}</div>
                            </button>
                        ))}
                    </div>
                    {/* Bảng chọn dịch vụ */}
                    <Modal
                        open={!!selectedClinic}
                        onCancel={() => setSelectedClinic(null)}
                        footer={null}
                        closable={false}
                        width={1000}
                        centered
                    >
                        {selectedClinic && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-center text-green-600 text-[28px]">
                                {selectedClinic.name}
                            </h2>
                            <div className="grid grid-cols-2 gap-[20px]">
                            {selectedClinic.services.map((service, idx) => (
                                <button
                                key={idx}
                                className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200 text-[25px]"
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
                        closable={false}
                        width={1000}
                        centered
                    >
                        <RegisterInfo patientInfo={patientInfo} npInfo={npInfo} selectedService={selectedService} flow={flow} ></RegisterInfo>
                        <br></br>
                        <div className="grid grid-cols-2 gap-[20px]">
                            <button
                                className="text-[25px] hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl hover:from-gray-500 hover:to-gray-700 disabled:opacity-50"
                                onClick={() => {setConfirm(false)}}>
                                Hủy bỏ
                            </button>
                            <button
                                className="text-[25px] hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={sendRegistration}>
                                {(flow === "insur" ? "Bước tiếp theo: In phiếu" : "Bước tiếp theo: Thanh toán")}
                            </button>
                        </div>
                    </Modal>
                </div>

                <div className="flex flex-col justify-center text-[25px] md:text-[28px] lg:text-[30px] mb-3">
                    <p className="text-colorOne my-4 font-semibold px-4 py-2 bg-white rounded-xl ">{selectedService ? `Dịch vụ đã chọn: ${selectedService.clinic} - ${selectedService.name} - ${flow === "insur" ? "Bảo hiểm chi trả: " : ""} ${selectedService.price} VNĐ` : "" }</p>
                    
                        <div className="grid grid-cols-2 gap-[30px]">
                            {/* Nút điều khiển */}
                            <button
                                className="text-[25px] hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl hover:from-gray-500 hover:to-gray-700 disabled:opacity-50"
                                onClick={() => {navigate(-1)}}>
                                Trở lại
                            </button>
                            <button disabled={booking}
                                className="text-[25px] hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                                onClick={handleConfirm}>
                                {loading === true ? (<span className="loading-dots">Đang xử lý</span>) : ("Xác thực")}
                            </button>
                        </div>
                </div>
            </div>
        </>
    )
}