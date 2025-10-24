import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [brioDeviceId, setBrioDeviceId] = useState("");
  const [countdown, setCountdown] = useState(6);
  const [errorMsg, setErrorMsg] = useState("");
  const [retryKey, setRetryKey] = useState(0); // để remount Webcam khi retry

  // Lấy deviceId của Brio 500
  useEffect(() => {
    async function getBrioDevice() {
      try {
        // Lấy danh sách camera
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === "videoinput");

        // Chọn Brio 500 theo label
        const brio = videoDevices.find(d =>
          d.label.toLowerCase().includes("brio")
        );

        if (brio) {
          setBrioDeviceId(brio.deviceId);
        } else {
          setErrorMsg("Không tìm thấy camera Brio 500.");
        }
      } catch (err) {
        console.error("Lỗi enumerateDevices:", err);
        setErrorMsg("Không thể lấy danh sách camera.");
      }
    }

    getBrioDevice();

    const handleChange = () => getBrioDevice();
    navigator.mediaDevices.addEventListener("devicechange", handleChange);
    return () => navigator.mediaDevices.removeEventListener("devicechange", handleChange);
  }, []);

  // Release stream cũ trước khi mount Webcam mới
  useEffect(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(t => t.stop());
    }
  }, [brioDeviceId, retryKey]);

  // Chụp ảnh
  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  };

  // Countdown tự động
  useEffect(() => {
    if (!brioDeviceId) return;
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, brioDeviceId]);

  // Retry khi cam bị exclusive access
  const handleRetry = () => {
    setErrorMsg("");
    setRetryKey(k => k + 1);
    setCountdown(6);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Vui lòng nhìn thẳng vào camera Brio 500
      </h2>

      {errorMsg && (
        <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
      )}

      {brioDeviceId && (
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
                "Không thể bật camera Brio 500. Có thể đang được ứng dụng khác sử dụng. Hãy đóng các ứng dụng khác và nhấn Thử lại."
              );
            }}
            videoConstraints={{
              width: 480,
              height: 360,
              deviceId: { exact: brioDeviceId },
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
        {brioDeviceId
          ? `Camera Brio 500 sẵn sàng - chụp sau ${countdown}s`
          : "Đang tìm camera Brio 500..."}
      </div>
    </div>
  );
}