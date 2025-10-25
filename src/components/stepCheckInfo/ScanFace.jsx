import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [brioDeviceId, setBrioDeviceId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 🔍 Tìm camera Iriun (Brio)
  const findBrio = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const brio = devices.find(
        (d) => d.kind === "videoinput" && d.label.toLowerCase().includes("brio")
      );
      if (brio) {
        setBrioDeviceId(brio.deviceId);
        setErrorMsg("");
        return true;
      } else {
        setErrorMsg("Không tìm thấy camera. Vui lòng rút thẻ ra và thử lại.");
        setBrioDeviceId("");
        return false;
      }
    } catch {
      setErrorMsg("Không thể truy cập danh sách thiết bị camera.");
      return false;
    }
  };

  // 📸 Hàm chụp ảnh (crop phần giữa 1/3)
  const capture = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const cropW = w / 3;
    const cropX = (w - cropW) / 2;

    canvas.width = cropW;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, cropX, 0, cropW, h, 0, 0, cropW, h);

    const imgData = canvas.toDataURL("image/jpeg");
    setImage(imgData);

    // Reset trạng thái
    setIsCapturing(false);
    setCountdown(null);
  };

  // ▶️ Khi nhấn “Khởi động camera”
  const handleStartCamera = async () => {
    setErrorMsg("");
    setIsStarting(true);
    setIsCameraReady(false);
    setIsCapturing(false);
    setCountdown(null);

    const found = await findBrio();
    if (!found) {
      setIsStarting(false);
      return;
    }

    // ✅ Đợi 3 giây cho camera ổn định, rồi tự bắt đầu đếm ngược chụp
    setTimeout(() => {
      setIsCameraReady(true);
      setIsStarting(false);
      setIsCapturing(true);
      setCountdown(6); // đếm ngược 6s để người dùng chuẩn bị
    }, 3000);
  };

  // ⏱️ Đếm ngược rồi chụp
  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Vui lòng rút thẻ ra, nhấn "Khởi động camera", nhìn vào ống kính phía trên.
      </h2>

      {errorMsg && <div className="text-red-600">{errorMsg}</div>}

      {/* Hiển thị webcam */}
      {brioDeviceId && (
        <div className="relative border rounded-lg overflow-hidden w-[480px] h-[360px]">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full rounded-lg"
            videoConstraints={{
              width: 480,
              height: 360,
              deviceId: { exact: brioDeviceId },
            }}
          />

          {/* Overlay khu vực khuôn mặt */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse 33.33% 35% at center,
                  transparent 99%,
                  rgba(0,0,0,0.7) 100%
                )
              `,
            }}
          ></div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Trạng thái hiển thị */}
      {isStarting && <div className="text-blue-600 font-semibold">Đang khởi động camera...</div>}
      {isCapturing && countdown !== null && (
        <div className="text-xl font-bold text-green-600">Chụp sau {countdown}s...</div>
      )}

      {/* Nút hành động */}
      <div className="flex flex-col gap-3 mt-3">
        <button
          onClick={handleStartCamera}
          disabled={isStarting || isCapturing}
          className={`px-5 py-2 rounded text-white text-lg font-medium ${
            isStarting || isCapturing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isStarting
            ? "Đang khởi động..."
            : isCapturing
            ? "Đang chụp..."
            : "Khởi động camera"}
        </button>

        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => navigate("/mer")}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
