import { useState, useEffect } from "react";
import { Select, Input } from "antd";
import { useGlobal } from "../../context/GlobalContext";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import {
  getProvince,
  getNationality,
  getEthnic,
  getOccupations,
} from "../../api/call_API";
import "react-simple-keyboard/build/css/index.css";

export default function InputForm() {
  const { npInfo, setNpInfo } = useGlobal()
  const [activeField, setActiveField] = useState("")
  const [keyboardInput, setKeyboardInput] = useState("")
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

  useEffect(() => {
    setKeyboardInput("")
  }, [activeField])

  useEffect(() => {
    setNpInfo(formData)
    console.log("data", npInfo);
  }, [formData])

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
        .filter((item) => item.MA_QUOCGIA != null && item.MA_QUOCGIA !== "")
        .map((item) => ({
          MA_QT: item.MA_QUOCGIA,
          TEN_QT: item.TEN_QUOCGIA,
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
  // Xử lý phone input
  const checkPhoneInput = (value) => {
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      return true
    }
    return false
  }
  // Xử lý thay đổi Select
  const handleInputChange = (key, value) => {
    if (key === "phone") {
      if (checkPhoneInput(value)) {
        setFormData((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
        ...(key === "province" ? { commune: "" } : {}
        ), // reset xã nếu đổi tỉnh
      }));
    }
  };

  // Xử lý input từ bàn phím ảo
  const handleKeyboardInput = (input) => {
    setKeyboardInput(input);
    if (activeField) {
      handleInputChange(activeField, input);
    }
  };


  const fields = [
    { label: "Tỉnh / Thành phố (*)", key: "province" },
    { label: "Xã / Phường (*)", key: "commune" },
    { label: "Dân tộc (*)", key: "ethnic" },
    { label: "Quốc tịch (*)", key: "national" },
    { label: "Nghề nghiệp", key: "job" },
    { label: "Điện thoại", key: "phone" },
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
          value={formData.phone}
            maxLength={10}
            onFocus={() => setActiveField("phone")}
            placeholder="Nhập số điện thoại"
            className="w-[65%]"
          />
        </div>

        {/* Các trường select */}
        {/* Tỉnh / Thành phố */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Tỉnh / Thành phố (*):
          </label>
          <Select
            showSearch
            value={formData.province}
            placeholder="Chọn hoặc nhập tỉnh / thành phố"
            onFocus={() => setActiveField("province")}
            onChange={(value) => handleInputChange("province", value)}
            className="w-[65%]"
            options={TINH?.map((t) => ({ value: t.MA_TINH, label: t.TEN_TINH })) || []}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* Xã / Phường */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Xã / Phường (*):
          </label>
          <Select
            showSearch
            value={formData.commune}
            placeholder="Chọn hoặc nhập xã / phường"
            onFocus={() => setActiveField("commune")}
            onChange={(value) => handleInputChange("commune", value)}
            className="w-[65%]"
            options={
              XA?.filter((x) => x.MA_TINH === formData.province).map((x) => ({
                value: x.MA_XA,
                label: x.TEN_XA,
              })) || []
            }
            disabled={!formData.province}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* Dân tộc */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Dân tộc (*):
          </label>
          <Select
            showSearch
            value={formData.ethnic}
            placeholder="Chọn hoặc nhập dân tộc"
            onFocus={() => setActiveField("ethnic")}
            onChange={(value) => handleInputChange("ethnic", value)}
            className="w-[65%]"
            options={ETHIC?.map((e) => ({ value: e.MA_DT, label: e.TEN_DT })) || []}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* Quốc tịch */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Quốc tịch (*):
          </label>
          <Select
            showSearch
            value={formData.national}
            placeholder="Chọn hoặc nhập quốc tịch"
            onFocus={() => setActiveField("national")}
            onChange={(value) => handleInputChange("national", value)}
            className="w-[65%]"
            options={NAL?.map((n) => ({ value: n.MA_QT, label: n.TEN_QT })) || []}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* Nghề nghiệp */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[16px] text-gray-700 w-[35%] text-right">
            Nghề nghiệp:
          </label>
          <Select
            showSearch
            value={formData.job}
            placeholder="Chọn hoặc nhập nghề nghiệp"
            onFocus={() => setActiveField("job")}
            onChange={(value) => handleInputChange("job", value)}
            className="w-[65%]"
            options={JOB?.map((j) => ({ value: j.MA_NN, label: j.TEN_NN })) || []}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
        
      </div>

      {/* Bàn phím ảo */}
      {activeField && (
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
      )}
    </div>
  );
}
