import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { BsX, BsCheck } from "react-icons/bs";
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { useGlobal } from '../context/GlobalContext';
import { LoadingOutlined } from '@ant-design/icons'
import { CAMERA_WS_URL } from '../api/config'
import { openNotificationWithIcon } from '../utils/helpers';
import { getPatientInfo, getPatientInsurance } from '../api/call_API';

export default function CheckInfo() {
    const [localLoading, setLocalLoading] = useState(true)
    const [nonInserCase, setNonInserCase] = useState(false)
    const { setStateStep, patientInfo, setPatientInfo, flow } = useGlobal();
    const navigate = useNavigate()

    // Chỉnh bước 1
    useEffect(() => {
        setStateStep(1)
        if (patientInfo?.personalInfo) {
            toggleStatus(0);
            toggleStatus(1);
        }
        if (patientInfo?.patientHISInfo) {
            toggleStatus(2);
        }
        if (patientInfo?.insuranceInfo) {
            toggleStatus(3);
        }
    }, [setStateStep])

    // state để track từng thông tin
    const [fields, setFields] = useState(
        flow === "insur" ?
    [
        { label: "Thông tin thẻ", status: false },
        { label: "Ảnh thẻ", status: false },
        { label: "Thông tin bệnh nhân", status: false },
        { label: "Thông tin bảo hiểm", status: false },
    ] : [
        { label: "Thông tin thẻ", status: false },
        { label: "Ảnh thẻ", status: false },
        { label: "Thông tin bệnh nhân", status: false }
    ]);

    // điều khiển hiện thị thông tin
    const toggleStatus = (index) => {
        const newFields = [...fields];
        newFields[index].status = !newFields[index].status;
        setFields(newFields);
    };

    // Liên kết đầu đọc lấy dữ liệu CCCD
    useEffect(() => {
		const socket = new WebSocket(CAMERA_WS_URL);

		socket.onopen = () => {
			console.log("WebSocket connected!");
		};

		socket.onmessage = (event) => {
			try {
				const receivedData = JSON.parse(event.data);

				if (receivedData.id === "2") {
                    console.log(receivedData);
                    toggleStatus(0)
					setPatientInfo((prev) => {
						return {
							...prev,
							personalInfo: receivedData,
						};
					});
				} else if (receivedData.id === "4") {
                    console.log(receivedData);
                    toggleStatus(1)
					setPatientInfo((prev) => {
						return {
							...prev,
							faceImage: receivedData,
						};
					});
				}
			} catch (err) {
				console.log("Error parsing WebSocket message:", err);
                openNotificationWithIcon("Lỗi kết nối", "Lỗi kết nối với đầu đọc thẻ")
			}
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		socket.onerror = (event) => {
			console.log("WebSocket error:", event);
		};

		return () => {
			socket.close();
			console.log("WebSocket disconnected");
		};
	}, []);

    // Lấy dữ liệu bệnh nhân từ HIS
    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const patientIDCard = patientInfo.personalInfo.data.idCode
                const respone = await getPatientInfo(patientIDCard)
                console.log(respone)
                if (respone.code === "000") {
                    // Dữ liệu trả về chống -> ko có dữ liệu -> Thêm bệnh nhân
                    if (respone.data == null) {
                        navigate("/mer/new-patient")
                    } else {
                        setPatientInfo((prev) => {
                            return {
                                ...prev,
                                patientHISInfo: respone.data,
                            };
                        });
                        toggleStatus(2)
                    }
                } else {
                    navigate("/mer/new-patient")
                }
            } catch (error) {
                console.log(error);
                openNotificationWithIcon("Lỗi", "Lỗi lấy dữ liệu bệnh nhân");
            }
        }
        fetchPatientInfo()
    }, [patientInfo?.personalInfo])

    // Lấy dữ liệu bhyt
    useEffect(() => {
        const fetchPatientInsur = async () => {
            try {
                const patientIDCard = patientInfo?.personalInfo?.data.idCode
                const patientName = patientInfo?.personalInfo?.data.personName;
                const patientDOB = patientInfo?.personalInfo?.data.dateOfBirth;
                const respone = await getPatientInsurance(patientIDCard, patientName, patientDOB)
                if (respone.code === "000") {
                    if (respone.data == null) {
                        setNonInserCase(true)
                    } else {
                        setPatientInfo((prev) => {
                            return {
                                ...prev,
                                insuranceInfo: respone.data,
                            };
                        });
                        toggleStatus(3)
                    }
                }
            } catch (error) {
                console.log(error);
                openNotificationWithIcon("Lỗi", "Lỗi lấy dữ liệu bhyt");
            }
        }
        if (flow === "insur") fetchPatientInsur()
    }, [patientInfo?.personalInfo])

    // Kiểm tra thông tin nhận
    useEffect(() => {
        const allChecked = fields.every(f => f.status === true);
        if (allChecked) {
            setTimeout(() => {
            setLocalLoading(false)
            }, 1000)
        }
    }, [fields])

    const handleNextStep = ( () => {
        if (flow === "insur") {
            navigate("/mer/insur/register")
        } else {
            navigate("/mer/non-insur/register")
        }
    })

    return (
        <>
            <Helmet>
                <title>Kiểm tra thông tin</title>
            </Helmet>
            {/* Kiểm tra thông tin */}
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Vui lòng đưa căn cước công dân vào máy</div>
                <br></br>
                <div className="flex flex-col space-y-2">
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                        >
                        <div className="flex items-center space-x-2">
                            {field.status ? (
                            <BsCheck className="text-green-500" />
                            ) : (
                            <BsX className="text-red-500" />
                            )}
                            <span>{field.label}</span>
                        </div>
                    </div>
                ))}
                </div>
                <br></br>
                <div className="flex px-10 items-center justify-center bg-gradient-to-r from-colorTwo to-colorFive text-black rounded-xl 
                                            hover:from-green-500 hover:to-emerald-600 hover:scale-105 
                                            transition-all duration-500 ease-in-out">
                    <button className="text-white cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]" onClick={() => navigate(-1)}>
                        Trở lại
                    </button>
                </div>
            </Modal>

            <Modal
                open={nonInserCase}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <div className="text-lg font-semibold loading-dots">Bạn không có bảo hiểm, chỉ có thể chọn khám dịch vụ.</div>
                <br></br>
                <div className="flex px-10 items-center justify-center bg-gradient-to-r from-colorTwo to-colorFive text-black rounded-xl 
                                            hover:from-green-500 hover:to-emerald-600 hover:scale-105 
                                            transition-all duration-500 ease-in-out">
                    <button className="text-white cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]" onClick={() => navigate("/mer")}>
                        Ok
                    </button>
                </div>
            </Modal>
            
            <div className={`transition-all duration-300 ${localLoading ? 'blur-sm !bg-white/20' : ''}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1>Xác thực công dân</h1>
                    </div>

                    <div className='flex justify-center'>
                        <div className='w-full sm:w-[80%] lg:w-[45vw] grid grid-cols-3 gap-4 text-left'>

                            {/* Cột 1: Ảnh */}
                            <div className='flex justify-center items-start'>
                                {patientInfo?.faceImage?.data?.img_data ? (
                                    <img
                                        src={patientInfo.faceImage.data.img_data}
                                        alt='Ảnh công dân'
                                        className='w-32 h-40 object-cover rounded-lg border'
                                    />
                                ) : null}
                            </div>

                            {/* Cột 2: Tên các trường */}
                            <div className='flex flex-col justify-start gap-2 font-semibold text-gray-700'>
                                <span>Họ và tên:</span>
                                <span>Ngày sinh:</span>
                                <span>Giới tính:</span>
                                <span>Quốc tịch:</span>
                                <span>Quê quán:</span>
                                <span>Địa chỉ thường trú:</span>
                                <span>Số điện thoại:</span>
                            </div>

                            {/* Cột 3: Thông tin tương ứng */}
                            <div className='flex flex-col justify-start gap-2 text-gray-800'>
                                {patientInfo?.personalInfo && patientInfo?.patientHISInfo ? (
                                    <>
                                        <span>{patientInfo.personalInfo.data.personName}</span>
                                        <span>{patientInfo.personalInfo.data.dateOfBirth}</span>
                                        <span>{patientInfo.personalInfo.data.gender}</span>
                                        <span>{patientInfo.personalInfo.data.nationality}</span>
                                        <span>{patientInfo.personalInfo.data.originPlace}</span>
                                        <span>{patientInfo.personalInfo.data.residencePlace}</span>
                                        <span>{patientInfo.patientHISInfo.DIEN_THOAI}</span>
                                    </>
                                ) : null}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Nút dưới cùng */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] lg:w-[45vw] flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                >
                    Trở lại
                </button>

                <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
                >
                    Tiếp tục
                </button>
            </div>
        </>
    )
}