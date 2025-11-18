import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { BsX, BsCheck } from "react-icons/bs";
import { Helmet } from "react-helmet-async"
import { Modal } from 'antd'
import { useGlobal } from '../../context/GlobalContext';
import { LoadingOutlined } from '@ant-design/icons'
import { CAMERA_WS_URL } from '../../api/config'
import { openNotification, getResidencePlace } from '../../utils/helpers';
import { getPatientInfo, get_bhyt } from '../../api/call_API';
import InsertPatient from '../registerNewPatient/InsertPatient';
import PatientInfoDisplay from './PatientInfoDisplay';
import ScanFace from './ScanFace';

export default function CheckInfoCCCD( {provinces, communes} ) {
    const correctLimit = 60
    const [localLoading, setLocalLoading] = useState(true)
    const [nonInserCase, setNonInserCase] = useState(false)
    const [getHIS, setGetHIS] = useState(false)
    const [getInsur, setGetInsur] = useState(false)
    const [addPatient, setAddPatient] = useState(false)
    const [imgCapture, setImgCapture] = useState(false)
    const [image, setImage] = useState(null)
    const { setStateStep, patientInfo, setPatientInfo, flow, npInfo, logGlobal} = useGlobal();
    const navigate = useNavigate()

    const isInteger = (value) => {
        const n = parseInt(value, 10);
        return !isNaN(n) && n.toString() === value.toString();
    };

    // Chỉnh bước 1
    useEffect(() => {
        setStateStep(1)
    }, [])

    // state để track từng thông tin
    const [fields, setFields] = useState(
        flow === "insur" ?
    [
        { label: "Thông tin thẻ", status: false },
        { label: "Ảnh thẻ", status: false },
        { label: "Xác thực khuôn mặt", status: false },
        { label: "Thông tin bệnh nhân", status: false },
        { label: "Thông tin bảo hiểm", status: false },
    ] : [
        { label: "Thông tin thẻ", status: false },
        { label: "Ảnh thẻ", status: false },
        { label: "Xác thực khuôn mặt", status: false },
        { label: "Thông tin bệnh nhân", status: false }
    ]);

    // kiểm tra xem thông tin đã có, nếu quay lại từ bước trước
    useEffect(() => {
        if (patientInfo?.personalInfo) {
            toggleStatus(0);
            toggleStatus(1);
        }
        if (patientInfo.facePass) {
            toggleStatus(2);
        }
        if (patientInfo?.patientHISInfo || npInfo?.province) {
            toggleStatus(3);
        }
        if (patientInfo?.insuranceInfo) {
            toggleStatus(4);
        }
    }, [])

    // xử lý khi camera trả ảnh về
    useEffect(() => {
        if (image !== null) {
            setImgCapture(false)
            const socket = new WebSocket(CAMERA_WS_URL)

            socket.onopen = async () => {
                console.log("WebSocket connected! Check image");
            };

            socket.onmessage = async (event) => {
                try {
                    if (event.data === "Đã kết nối!") {
                        const payload = {
                            "faceCore": patientInfo.faceImage.data.img_data,
                            "faceLive": image
                        }
                        socket.send(JSON.stringify(payload))
                    }

                    if (isInteger(event.data)) {
                        const correct = parseInt(event.data)
                        console.log("correct: ", correct)
                        if (correct >= correctLimit) {
                            toggleStatus(2)
                            setPatientInfo((prev) => { 
                                return { ...prev, facePass: true}; 
                            });
                            if (flow === "insur") {
                                setGetInsur(true)
                            } else {
                                setGetHIS(true)
                            }
                            socket.close()
                        } else {
                            openNotification("Thông báo", "Xác thực khuôn mặt không thành công", "warning")
                            console.log("Xác thực khuôn mặt không thành công")
                            socket.close()
                        }
                    }

                } catch (err) {
                    console.log("Error parsing WebSocket message:", err);
                }
            };

            socket.onclose = async () => {
                console.log("WebSocket connection closed");
            };

            socket.onerror = async (event) => {
                console.log("WebSocket error:", event);
            };
        }
    }, [image])

    // điều khiển hiện thị thông tin
    const toggleStatus = (index) => {
        const newFields = [...fields];
        newFields[index].status = true;
        setFields(newFields);
    };

    // đóng thêm modal thông tin
    const closeAddPatient = async () => {
        toggleStatus(3)
        setAddPatient(false)
        const residencePlace = getResidencePlace(provinces, communes, 
                npInfo?.province,
                npInfo?.commune,
        )
        setPatientInfo(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                data: {
                    ...prev.personalInfo.data,
                    residencePlace,
                }
            }
        }));
    }

    // Liên kết đầu đọc lấy dữ liệu CCCD
    useEffect(() => {
        if (!fields.find(f => f.label === "Thông tin thẻ")?.status && !fields.find(f => f.label === "Ảnh thẻ")?.status) {
            const socket = new WebSocket(CAMERA_WS_URL);

            socket.onopen = async () => {
                console.log("WebSocket connected!");
            };

            socket.onmessage = async (event) => {
                try {
                    const receivedData = await JSON.parse(event.data);

                    if (receivedData.id === "2") {
                        toggleStatus(0)
                        setPatientInfo((prev) => {
                            return {
                                ...prev,
                                personalInfo: receivedData,
                            };
                        });
                    } else if (receivedData.id === "4") {
                        toggleStatus(1)
                        await setPatientInfo((prev) => {
                            return {
                                ...prev,
                                faceImage: receivedData,
                            };
                        });
                        setImgCapture(true)
                        socket.close();
                    }
                } catch (err) {
                    console.log("Error parsing WebSocket message:", err);
                }
            };

            socket.onclose = async () => {
                console.log("WebSocket connection closed");
            };

            socket.onerror = async (event) => {
                console.log("WebSocket error:", event);
            };

            return () => {
                socket.close();
                console.log("WebSocket disconnected");
            };
        }
		return () => {
            console.log("Đã có thông tin");
        };
	}, []);

    // Lấy dữ liệu bệnh nhân từ HIS 
    const fetchPatientInfo = async () => { 
        try { 
            const patientIDCard = await patientInfo?.personalInfo?.data.idCode 
            const respone = await getPatientInfo(patientIDCard) 
            if (respone.code === "000") { 
                // Dữ liệu trả về chống -> ko có dữ liệu -> Thêm bệnh nhân 
                if (respone.data == null) { 
                    setAddPatient(true) 
                } else { 
                    setPatientInfo((prev) => { 
                        return { ...prev, patientHISInfo: respone.data}; 
                    }); 
                    const dia_chi = respone.data.DIA_CHI
                    setPatientInfo(prev => ({
                        ...prev,
                        personalInfo: {
                            ...prev.personalInfo,
                            data: {
                                ...prev.personalInfo.data,
                                dia_chi,
                            }
                        }
                    }));
                    toggleStatus(3)
                } 
            } else { 
                openNotification("Không có dữ liệu bệnh nhân", "Vui lòng nhập thêm dữ liệu") 
                setAddPatient(true) 
            } 
        } catch (error) {
            console.log(error); 
            openNotification("Lỗi", "Lỗi lấy dữ liệu bệnh nhân"); 
        } 
    } 

    useEffect(() => {
        if (getHIS) {
            if (!npInfo) { 
                if (!patientInfo?.patientHISInfo) {
                    fetchPatientInfo(); 
                } 
            }
        }
        setGetHIS(false)
    }, [getHIS])

    // Lấy dữ liệu bhyt
    const fetchPatientInsur = async () => {
        try {
            const idCard = await patientInfo?.personalInfo?.data.idCode;
            const name = await patientInfo?.personalInfo?.data.personName;
            const dob = await patientInfo?.personalInfo?.data.dateOfBirth;

            // const b = await getOccupations()

            const respone = await get_bhyt(idCard, name, dob);
            if (respone) {
                setPatientInfo(prev => ({ ...prev, insuranceInfo: respone.data }));
                toggleStatus(4);
                setGetHIS(true)
            } else {
                setNonInserCase(true);
            }
        } catch (error) {
            console.log("Lỗi lấy dữ liệu bhyt", error);
            openNotification("Lỗi", "Lỗi lấy dữ liệu bhyt");
        }
    };

    useEffect(() => {
        if (getInsur) {
            if (flow === "insur") {
                fetchPatientInsur();
            }
        }
        setGetInsur(false)
    }, [getInsur]);

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
        logGlobal()
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
                width={900}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-[25px] text-lg font-semibold text-[23px] loading-dots">VUI LÒNG ĐƯA CĂN CƯỚC CÔNG DÂN VÀO MÁY</div>
                <br></br>
                <div className="text-[25px] flex flex-col space-y-2">
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
                <div className="flex px-10 items-center justify-center bg-gradient-to-r from-gray-400 to-gray-600 
                                text-white rounded-xl hover:from-gray-500 hover:to-gray-700 hover:scale-105 
                                            transition-all duration-500 ease-in-out">
                    <button className="text-white cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]" onClick={() => navigate("/mer")}>
                        Trở lại
                    </button>
                </div>
            </Modal>

            {/* Báo không bảo hiểm */}
            <Modal
                open={nonInserCase}
                footer={null}
                closable={false}
                centered
                styles={{ body: { textAlign: "center" } }}
            >
                <div className="text-lg text-red-700 font-semibold">Bạn không có bảo hiểm, chỉ có thể chọn khám dịch vụ</div>
                <br></br>
                <div className="flex px-10 items-center justify-center bg-gradient-to-r from-colorTwo to-colorFive text-black rounded-xl 
                                            hover:from-green-500 hover:to-emerald-600 hover:scale-105 
                                            transition-all duration-500 ease-in-out">
                    <button className="text-white cursor-pointer p-2 text-[14px] sm:text-[18px] font-semibold lg:text-[22px]" onClick={() => navigate("/mer")}>
                        Ok
                    </button>
                </div>
            </Modal>

            {/* Thêm thông tin */}
            <Modal
                open={addPatient && !nonInserCase}
                footer={null}
                width={1000}
                closable={false}
                centered
                styles={{ body: { textAlign: "center" } }}
            >
                <InsertPatient patientInfo={patientInfo} onBack={closeAddPatient}></InsertPatient>
            </Modal>

            {/* Chụp ảnh */}
            <Modal
                open={imgCapture}
                footer={null}
                closable={false}
                centered
                style={{ textAlign: "center" }}
                width={1000}
            >
                <ScanFace setImage={setImage} ></ScanFace>
            </Modal>
            
            <div className={`transition-all duration-300 ${localLoading ? 'blur-sm !bg-white/20' : ''}`}>
                <div className='text-center px-7 py-8 rounded-lg'>
                    <div className='mb-3 text-colorOne font-bold text-[18px] lg:text-[25px]'>
                        <h1 className='text-[2rem]' >XÁC THỰC CÔNG DÂN</h1>
                    </div>
                    <PatientInfoDisplay patientInfo={patientInfo} npInfo={npInfo} flow={flow}></PatientInfoDisplay>
                </div>
            </div>
            {/* Nút dưới cùng */}
            <div className="flex gap-4 w-[90%] sm:w-[80%] lg:w-[45vw] mx-auto mt-6 mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 
                            text-white rounded-xl hover:from-gray-500 hover:to-gray-700 
                            transition-all duration-500 ease-in-out 
                            font-semibold text-[20px] sm:text-[25px] lg:text-[30px]"
                >
                    Trở lại
                </button>

                <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive 
                            text-white rounded-xl hover:from-green-500 hover:to-emerald-600 
                            transition-all duration-500 ease-in-out 
                            font-semibold text-[20px] sm:text-[25px] lg:text-[30px]"
                >
                    Tiếp tục
                </button>
            </div>
        </>
    )
}