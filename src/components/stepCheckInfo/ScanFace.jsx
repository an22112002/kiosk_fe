import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [countdown, setCountdown] = useState(6);
  const [errorMsg, setErrorMsg] = useState("");
  const [retryKey, setRetryKey] = useState(0); // dùng để remount Webcam khi retry

  // Lấy danh sách camera
  useEffect(() => {
    async function getDevices() {
      try {
        // Xin quyền camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());
      } catch (err) {
        console.warn("Không lấy được quyền camera:", err);
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === "videoinput");
      setDevices(videoDevices);

      // Chọn camera Brio 500 nếu có
      const brio = videoDevices.find(d => d.label.toLowerCase().includes("brio"));
      if (brio) setDeviceId(brio.deviceId);
      else if (videoDevices.length) setDeviceId(videoDevices[0].deviceId);
    }

    getDevices();

    const handleChange = () => getDevices();
    navigator.mediaDevices.addEventListener("devicechange", handleChange);
    return () => navigator.mediaDevices.removeEventListener("devicechange", handleChange);
  }, []);

  // Release stream cũ trước khi mount Webcam mới
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(t => t.stop());
    }
  }, [deviceId, retryKey]);

  // Chụp ảnh
  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  };

  // Countdown tự động
  useEffect(() => {
    if (!deviceId) return;
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, deviceId]);

  // Retry nếu cam bị exclusive access
  const handleRetry = () => {
    setErrorMsg("");
    setRetryKey(k => k + 1);
    setCountdown(6);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Vui lòng nhìn thẳng vào camera
      </h2>

      {errorMsg && (
        <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
      )}

      {devices.length > 1 && (
        <select
          className="border rounded px-3 py-1 mb-3"
          value={deviceId}
          onChange={e => {
            setDeviceId(e.target.value);
            setCountdown(6);
            setRetryKey(k => k + 1); // remount Webcam khi đổi device
          }}
        >
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Camera ${d.deviceId}`}
            </option>
          ))}
        </select>
      )}

      {/* Render Webcam chỉ khi deviceId có giá trị */}
      {deviceId && (
        <div className="relative border rounded-lg overflow-hidden">
          <Webcam
            key={retryKey} // remount nếu retry
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-[480px] h-auto bg-black"
            onUserMediaError={(err) => {
              console.error("Webcam error:", err);
              setErrorMsg(
                "Không thể bật camera. Có thể thiết bị đang được ứng dụng khác sử dụng. Hãy đóng các ứng dụng khác và nhấn Thử lại."
              );
            }}
            videoConstraints={{
              width: 480,
              height: 360,
              deviceId: { exact: deviceId },
            }}
          />
        </div>
      )}

      {errorMsg && (
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleRetry}
        >
          Thử lại
        </button>
      )}

      <div className="mt-2 text-center text-lg font-semibold">
        {deviceId
          ? `Camera sẵn sàng - chụp sau ${countdown}s`
          : "Đang tìm camera..."}
      </div>
    </div>
  );
}