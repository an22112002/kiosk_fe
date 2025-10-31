import { useState, useEffect } from "react";
import { Select, Input } from "antd";
import { useGlobal } from "../../context/GlobalContext";
import Keyboard from "react-simple-keyboard";
import { processVietnameseBuffer } from "../../utils/helpers";
import "react-simple-keyboard/build/css/index.css";
import { useNavigate } from "react-router-dom";
import { openNotification } from "../../utils/helpers";

import {
  getProvince,
  getNationality,
  getEthnic,
  getOccupations,
} from "../../api/call_API";

export default function InputForm({ patientInfo, onBack }) {
  const { setNpInfo } = useGlobal();
  const navigate = useNavigate();

  const [activeField, setActiveField] = useState("");
  const [keyboardInput, setKeyboardInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // danh sách gợi ý

  const [formData, setFormData] = useState({
    province: "",
    commune: "",
    job: "",
    ethnic: "",
    national: "000",
    phone: patientInfo?.personalInfo?.data?.phone || "",
  });

  const [TINH, setTINH] = useState([]);
  const [XA, setXA] = useState([]);
  const [ETHIC, setETHIC] = useState([]);
  const [NAL, setNAL] = useState([]);
  const [JOB, setJOB] = useState([]);

  // Load dữ liệu API
  useEffect(() => {
    handleLoadProvince();
    handleLoadEthic();
    handleLoadNational();
    handleLoadJob();
  }, []);

  // Khi focus field khác → reset buffer
  useEffect(() => {
    setKeyboardInput("");
    setSuggestions([]);
  }, [activeField]);

  // Update global context khi formData thay đổi
  useEffect(() => {
    setNpInfo(formData);
  }, [formData]);

  const getFieldName = (n) => {
    switch (n) {
      case "phone":
        return "Điện thoại"
      case "province":
        return "Tỉnh / Thành phố"
      case "commune":
        return "Xã / Phường"
      case "job":
        return "Nghề nghiệp"
      case "ethnic":
        return "Dân tộc"
      case "national":
        return "Quốc gia"
      default:
        return ""
    }
  }

  // Load dữ liệu từ API
  const handleLoadProvince = async () => {
    const respone = await getProvince();
    if (respone.code === "000") {
      const provinces = Object.values(
        respone.data.reduce((acc, item) => {
          acc[item.MA_TINH] = { MA_TINH: item.MA_TINH, TEN_TINH: item.TEN_TINH };
          return acc;
        }, {})
      );
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
        .filter((item) => item.MA_QUOCGIA)
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
      TEN_NN: item.TEN_NGHENGHIEP, })); 
    setJOB(jobs); } 
  };

  // Xử lý input phone
  const checkPhoneInput = (value) => /^[0-9]*$/.test(value) && value.length <= 10;

  const handleInputChange = (key, value) => {
    if (key === "phone") {
      if (!checkPhoneInput(value)) return;
    } else if (key === "province") {
      // reset commune nếu đổi tỉnh
      setFormData((prev) => ({ ...prev, [key]: value, commune: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Tạo danh sách gợi ý theo trường
  const getSuggestionList = (key, text) => {
    if (!text.trim()) return [];

    const lower = text.toLowerCase();
    let data = [];

    switch (key) {
      case "province":
        data = TINH.filter((t) => t.TEN_TINH.toLowerCase().includes(lower));
        return data.map((t) => ({ value: t.MA_TINH, label: t.TEN_TINH }));
      case "commune":
        data = XA.filter(
          (x) =>
            x.MA_TINH === formData.province &&
            x.TEN_XA.toLowerCase().includes(lower)
        );
        return data.map((x) => ({ value: x.MA_XA, label: x.TEN_XA }));
      case "ethnic":
        data = ETHIC.filter((e) => e.TEN_DT.toLowerCase().includes(lower));
        return data.map((e) => ({ value: e.MA_DT, label: e.TEN_DT }));
      case "national":
        data = NAL.filter((n) => n.TEN_QT.toLowerCase().includes(lower));
        return data.map((n) => ({ value: n.MA_QT, label: n.TEN_QT }));
      case "job":
        data = JOB.filter((j) => j.TEN_NN.toLowerCase().includes(lower));
        return data.map((j) => ({ value: j.MA_NN, label: j.TEN_NN }));
      default:
        return [];
    }
  };

  // Người dùng nhập đúng label thì set luôn value
  const handleTypeFull = (processed) => {
    if (processed.trim()) {
    let matched = null;

    switch (activeField) {
      case "province":
        matched = TINH.find(
          (t) => t.TEN_TINH.toLowerCase() === processed.trim().toLowerCase()
        );
        if (matched) handleInputChange("province", matched.MA_TINH);
        break;
      case "commune":
        matched = XA.find(
          (x) =>
            x.MA_TINH === formData.province &&
            x.TEN_XA.toLowerCase() === processed.trim().toLowerCase()
        );
        if (matched) handleInputChange("commune", matched.MA_XA);
        break;
      case "ethnic":
        matched = ETHIC.find(
          (e) => e.TEN_DT.toLowerCase() === processed.trim().toLowerCase()
        );
        if (matched) handleInputChange("ethnic", matched.MA_DT);
        break;
      case "national":
        matched = NAL.find(
          (n) => n.TEN_QT.toLowerCase() === processed.trim().toLowerCase()
        );
        if (matched) handleInputChange("national", matched.MA_QT);
        break;
      case "job":
        matched = JOB.find(
          (j) => j.TEN_NN.toLowerCase() === processed.trim().toLowerCase()
        );
        if (matched) handleInputChange("job", matched.MA_NN);
        break;
      default:
        break;
    }

    // Nếu tìm thấy kết quả → reset keyboard buffer & gợi ý
    if (matched) {
      setKeyboardInput("");
      setSuggestions([]);
    }
  }}

  // Xử lý nhập bàn phím ảo
  const handleKeyboardInput = (input) => {
    if (!activeField) return;

    if (activeField === "phone") {
      let newBuffer = keyboardInput;
      if (input === "{bksp}") newBuffer = newBuffer.slice(0, -1);
      else if (/^[0-9]$/.test(input)) newBuffer += input;
      newBuffer = newBuffer.slice(0, 10);
      setKeyboardInput(newBuffer);
      handleInputChange("phone", newBuffer);
      return;
    }

    let buffer = keyboardInput;
    if (input === "{bksp}") buffer = buffer.slice(0, -1);
    else if (input.length === 1) buffer += input;
    else if (input === "{space}") buffer += " ";

    const processed = processVietnameseBuffer(buffer);
    setKeyboardInput(buffer);
    handleInputChange(activeField, processed);

    // cập nhật gợi ý
    const sug = getSuggestionList(activeField, processed);
    setSuggestions(sug);

    handleTypeFull(processed)
  };

  // Khi chọn gợi ý
  const handleSuggestionClick = (option) => {
    handleInputChange(activeField, option.value);
    setKeyboardInput("");
    setSuggestions([]);
  };

  // Kiểm tra dữ liệu khi nhấn "Tiếp tục"
  const checkNewPatientInfo = () => {
    console.log(formData);

    const requiredFields = ["province", "commune", "ethnic", "national", "phone"];
    const missing = requiredFields.filter((key) => !formData[key]);

    if (missing.length > 0) {
      openNotification(
        "Thông báo",
        "Vui lòng nhập đầy đủ các trường bắt buộc!",
        "warning"
      );
      return;
    }

    if (formData.phone.length < 10) {
      openNotification("Thông báo", "Số điện thoại phải có đủ 10 số!", "warning");
      return;
    }

    // Kiểm tra giá trị có tồn tại trong danh sách tương ứng không
    const validProvince = TINH.some((item) => item.MA_TINH === formData.province);
    const validCommune = XA.some((item) => item.MA_XA === formData.commune);
    const validEthnic = ETHIC.some((item) => item.MA_DT === formData.ethnic);
    const validNational = NAL.some((item) => item.MA_QT === formData.national);
    const validJob = formData.job === "" ? true : JOB.some((item) => item.MA_NN === formData.job);

    if (!validProvince) {
      openNotification("Thông báo", "Tỉnh/Thành phố không hợp lệ! Không có trong cơ sở dữ liệu!", "warning");
      return;
    }
    if (!validCommune) {
      openNotification("Thông báo", "Xã/Phường không hợp lệ! Không có trong cơ sở dữ liệu!", "warning");
      return;
    }
    if (!validEthnic) {
      openNotification("Thông báo", "Dân tộc không hợp lệ! Không có trong cơ sở dữ liệu!", "warning");
      return;
    }
    if (!validNational) {
      openNotification("Thông báo", "Quốc tịch không hợp lệ! Không có trong cơ sở dữ liệu!", "warning");
      return;
    }
    if (!validJob) {
      openNotification("Thông báo", "Nghề nghiệp không hợp lệ! Không có trong cơ sở dữ liệu!", "warning");
      return;
    }

    // Nếu mọi thứ hợp lệ
    if (onBack) onBack();
  };


  // UI
  return (
    <div className="text-[25px] flex flex-col items-center w-full">
      <div className="flex flex-col gap-4 w-full max-w-[900px]">
        {/* Phone */}
        <div className="flex items-center justify-between gap-3 w-full">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Số điện thoại (*):
          </label>
          <Input
            value={formData.phone}
            maxLength={10}
            onFocus={() => setActiveField("phone")}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-[65%] h-[120%]"
          />
        </div>

        {/* Province */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Tỉnh / Thành phố (*):
          </label>
          <Select
            showSearch
            value={formData.province}
            placeholder="Chọn hoặc nhập tỉnh / thành phố"
            onFocus={() => setActiveField("province")}
            onChange={(value) => handleInputChange("province", value)}
            className="w-[65%] h-[120%]"
            options={TINH.map((t) => ({ value: t.MA_TINH, label: t.TEN_TINH }))}
          />
        </div>

        {/* Commune */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Xã / Phường (*):
          </label>
          <Select
            showSearch
            value={formData.commune}
            placeholder="Chọn hoặc nhập xã / phường"
            onFocus={() => setActiveField("commune")}
            onChange={(value) => handleInputChange("commune", value)}
            className="w-[65%] h-[120%]"
            options={
              XA.filter((x) => x.MA_TINH === formData.province).map((x) => ({
                value: x.MA_XA,
                label: x.TEN_XA,
              }))
            }
            disabled={!formData.province}
          />
        </div>

        {/* Ethnic */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Dân tộc (*):
          </label>
          <Select
            showSearch
            value={formData.ethnic}
            placeholder="Chọn hoặc nhập dân tộc"
            onFocus={() => setActiveField("ethnic")}
            onChange={(value) => handleInputChange("ethnic", value)}
            className="w-[65%] h-[120%]"
            options={ETHIC.map((e) => ({ value: e.MA_DT, label: e.TEN_DT }))}
          />
        </div>

        {/* National */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Quốc tịch (*):
          </label>
          <Select
            showSearch
            value={formData.national || "000"}
            placeholder="Chọn hoặc nhập quốc tịch"
            onFocus={() => setActiveField("national")}
            onChange={(value) => handleInputChange("national", value)}
            className="w-[65%] h-[120%]"
            options={NAL.map((n) => ({ value: n.MA_QT, label: n.TEN_QT }))}
            disabled={formData.national === "000"} // khóa 000 - Việt Nam
          />
        </div>

        {/* Job */}
        <div className="flex items-center justify-between gap-3 w-full mb-2">
          <label className="font-medium text-[20px] text-gray-700 w-[35%] text-right">
            Nghề nghiệp:
          </label>
          <Select
            showSearch
            value={formData.job}
            placeholder="Chọn hoặc nhập nghề nghiệp"
            onFocus={() => setActiveField("job")}
            onChange={(value) => handleInputChange("job", value)}
            className="w-[65%] h-[120%]"
            options={JOB.map((j) => ({ value: j.MA_NN, label: j.TEN_NN }))}
          />
        </div>
      </div>

      {/* Bàn phím ảo */}
      {activeField && (
        <div className="mt-6 w-full max-w-[600px]">
          <p className="text-gray-600 text-center mb-2">
            Đang nhập cho trường:{" "}
            <span className="font-semibold text-colorOne">{getFieldName(activeField)}</span>
          </p>
          <Keyboard
            layout={{
              default: [
                "1 2 3 4 5 6 7 8 9 0",
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "z x c v b n m {bksp}",
                "{space}",
              ],
            }}
            display={{
              "{bksp}": "⌫",
              "{space}": "␣",
            }}
            onKeyPress={handleKeyboardInput}
          />
        </div>
      )}

      {/* Gợi ý nhập từ bàn phím ảo */}
      <div className="w-full max-w-[600px] mt-3 bg-white border rounded-lg shadow p-3 h-[200px] overflow-y-auto">
      {suggestions.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <p className="text-gray-600 text-center mb-2">Bạn đang nhập?</p>

          {/* Khung chứa có chiều cao cố định và scroll */}
            {suggestions.map((opt) => (
              <div
                key={opt.value}
                className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => handleSuggestionClick(opt)}
              >
                {opt.label}
              </div>
            ))}
        </div>
      )}
      </div>

      {/* Nhóm nút hành động */}
      <div className="flex justify-center gap-6 mt-8 w-full max-w-[700px] mx-auto">
        <button
          onClick={() => navigate("/mer")}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 
                      text-white rounded-xl hover:from-gray-500 hover:to-gray-700 
                      transition-all duration-300 font-semibold 
                      text-[16px] sm:text-[18px] lg:text-[22px]"
        >
          Trở lại chọn dịch vụ
        </button>

        <button
          onClick={checkNewPatientInfo}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-colorTwo to-colorFive 
                      text-white rounded-xl hover:from-green-500 hover:to-emerald-600 
                      transition-all duration-300 font-semibold 
                      text-[16px] sm:text-[18px] lg:text-[22px]"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
