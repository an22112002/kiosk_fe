import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [countdown, setCountdown] = useState(7);

  // Lấy danh sách camera
  useEffect(() => {
    async function getDevices() {
      try {
        // Yêu cầu quyền camera
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (err) {
        console.warn("Không lấy được quyền camera:", err);
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === "videoinput");
      setDevices(videoDevices);

      // chọn camera Brio 500 theo label
      const brio = videoDevices.find(d =>
        d.label.toLowerCase().includes("brio")
      );
      if (brio) setDeviceId(brio.deviceId);
      else if (videoDevices.length) setDeviceId(videoDevices[0].deviceId);
    }

    getDevices();

    // Lắng nghe thay đổi thiết bị
    const handleChange = () => getDevices();
    navigator.mediaDevices.addEventListener("devicechange", handleChange);

    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", handleChange);
  }, []);

  // Hàm chụp ảnh
  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  };

  // Tự động đếm ngược
  useEffect(() => {
    if (!deviceId) return; // chưa có camera thì đợi
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, deviceId]);

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Vui lòng nhìn thẳng vào camera
      </h2>

      {/* chọn camera nếu có nhiều thiết bị */}
      {devices.length > 1 && (
        <select
          className="border rounded px-3 py-1 mb-3"
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
        >
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Camera ${d.deviceId}`}
            </option>
          ))}
        </select>
      )}

      <div className="relative border rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-lg w-[480px] h-auto bg-black"
          videoConstraints={{
            width: 480,
            height: 360,
            deviceId: deviceId || undefined,
          }}
        />
      </div>

      <div className="mt-2 text-center text-lg font-semibold">
        {deviceId
          ? `Camera sẵn sàng - chụp sau ${countdown}s`
          : "Đang tìm camera..."}
      </div>
    </div>
  );
}
