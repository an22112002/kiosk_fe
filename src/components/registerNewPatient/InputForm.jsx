import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Input } from "antd";
import { useGlobal } from "../../context/GlobalContext";
import {
  getProvince,
  getNationality,
  getEthnic,
  getOccupations,
} from "../../api/call_API";
import "react-simple-keyboard/build/css/index.css";

export default function InputForm() {
  const navigate = useNavigate()
  const { setNpInfo, flow } = useGlobal()
  const [formData, setFormData] = useState({
    province: "",
    commune: "",
    job: "",
    ethnic: "",
    national: "",
    phone: ""
  });

  const [TINH, setTINH] = useState(null);
  const [XA, setXA] = useState(null);
  const [ETHIC, setETHIC] = useState(null);
  const [NAL, setNAL] = useState(null);
  const [JOB, setJOB] = useState(null);


  // Load dữ liệu từ API
  useEffect(() => {
    handleLoadProvince();
    handleLoadEthic();
    handleLoadNational();
    handleLoadJob();
  }, []);

  const handleLoadProvince = async () => {
    const respone = await getProvince();
    if (respone.code === "000") {
      // Lấy danh sách tỉnh (loại bỏ trùng)
      const provinces = Object.values(
        respone.data.reduce((acc, item) => {
          acc[item.MA_TINH] = {
            MA_TINH: item.MA_TINH,
            TEN_TINH: item.TEN_TINH,
          };
          return acc;
        }, {})
      );

      // Lấy danh sách xã
      const communes = respone.data.map((item) => ({
        MA_XA: item.MA_XA,
        TEN_XA: item.TEN_XA,
        MA_TINH: item.MA_TINH,
      }));

      setTINH(provinces);
      setXA(communes);
    }
  };

  const handleLoadEthic = async () => {
    const respone = await getEthnic();
    if (respone.code === "000") {
      const ethic = respone.data.map((item) => ({
        MA_DT: item.MA_DANTOC,
        TEN_DT: item.TEN_DANTOC,
      }));
      setETHIC(ethic);
    }
  };

  const handleLoadNational = async () => {
    const respone = await getNationality();
    if (respone.code === "000") {
      const national = respone.data
        .filter((item) => item.MA_QUOCTICH != null && item.MA_QUOCTICH !== "")
        .map((item) => ({
          MA_QT: item.MA_QUOCTICH,
          TEN_QT: item.TEN_QUOCTICH,
        }));
      setNAL(national);
    }
  };

  const handleLoadJob = async () => {
    const respone = await getOccupations();
    if (respone.code === "000") {
      const jobs = respone.data.map((item) => ({
        MA_NN: item.MA_NGHENGHIEP,
        TEN_NN: item.TEN_NGHENGHIEP,
      }));
      setJOB(jobs);
    }
  };

  // Xử lý thay đổi Select
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "province" ? { commune: "" } : {}
      ), // reset xã nếu đổi tỉnh
    }));
  };

  //
  const handleNextStep = () => {
    setNpInfo(formData)
    if (flow === "insur") {
      navigate("/mer/insur/register")
    }
    navigate("/mer/non-insur/register")
  }

  const fields = [
    { label: "Tỉnh / Thành phố (*)", key: "province" },
    { label: "Xã / Phường (*)", key: "commune" },
    { label: "Dân tộc (*)", key: "ethnic" },
    { label: "Quốc tịch (*)", key: "national" },
    { label: "Nghề nghiệp", key: "job" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col gap-4 w-full max-w-[700px]">
        {/* Số điện thoại */}
        <div className="flex items-center justify-between gap-3 w-full">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Số điện thoại (*):
          </label>
          <Input
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*$/.test(value)) {
                handleInputChange("phone", value)
              }
            }}
            placeholder="Nhập số điện thoại"
            className="w-[65%]"
          />
        </div>

        {/* Các trường select */}
        {fields.map((field) => {
          let options = [];
          switch (field.key) {
            case "province":
              options =
                TINH?.map((t) => ({ value: t.MA_TINH, label: t.TEN_TINH })) ||
                [];
              break;
            case "commune":
              options =
                XA?.filter((x) => x.MA_TINH === formData.province).map((x) => ({
                  value: x.MA_XA,
                  label: x.TEN_XA,
                })) || [];
              break;
            case "ethnic":
              options =
                ETHIC?.map((e) => ({ value: e.MA_DT, label: e.TEN_DT })) || [];
              break;
            case "national":
              options =
                NAL?.map((n) => ({ value: n.MA_QT, label: n.TEN_QT })) || [];
              break;
            case "job":
              options =
                JOB?.map((j) => ({ value: j.MA_NN, label: j.TEN_NN })) || [];
              break;
            default:
              options = [];
          }

          return (
            <div
              key={field.key}
              className="flex items-center justify-between gap-3 w-full mb-2"
            >
              <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
                {field.label}:
              </label>
              <Select
                showSearch
                value={formData[field.key]}
                placeholder={`Chọn hoặc nhập ${field.label.toLowerCase()}`}
                onFocus={null}
                onChange={(value) => handleInputChange(field.key, value)}
                className="w-[65%]"
                options={options}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                disabled={field.key === "commune" && !formData.province}
              />
            </div>
          );
        })}
      </div>

      {/* Bàn phím ảo */}
      {/* {activeField && (
        <div className="mt-6 w-full max-w-[600px]">
          <p className="text-gray-600 text-center mb-2">
            Đang nhập cho trường:{" "}
            <span className="font-semibold text-colorOne">
              {fields.find((f) => f.key === activeField)?.label}
            </span>
          </p>
          <Keyboard
            layout={{
                default: [
                "1 2 3 4 5 6 7 8 9 0",
                "q w e r t y u i o p",
                "{shift} a s d f g h j k l",
                "z x c v b n m {bksp}",
                "{space}"
                ],
                shift: [
                "! @ # $ % ^ & * ( )",
                "Q W E R T Y U I O P",
                "{shift} A S D F G H J K L",
                "Z X C V B N M {bksp}",
                "{space}"
                ]
            }}
            display={{
                "{bksp}": "⌫",
                "{space}": "␣",
                "{shift}": "⇧"
            }}
            onChange={handleKeyboardInput}
            inputName={activeField}
            input={keyboardInput}
          />
        </div>
      )} */}
        {/* Nút dưới cùng */}
          <div className="fixed left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] lg:w-[45vw] flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
            >Trở lại</button>

            <button
              onClick={handleNextStep}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl 
                            hover:from-green-500 hover:to-emerald-600 transition-all duration-500 ease-in-out 
                            font-semibold text-[14px] sm:text-[18px] lg:text-[22px]"
            >Tiếp tục</button>
            </div>
    </div>
  );
}
