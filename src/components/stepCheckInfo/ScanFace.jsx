import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [brioDeviceId, setBrioDeviceId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [waiting, setWaiting] = useState(false);

  // 🔄 Liên tục kiểm tra camera Brio 500
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const brio = devices.find(
          (d) => d.kind === "videoinput" && d.label.toLowerCase().includes("brio")
        );

        if (brio) {
          setBrioDeviceId(brio.deviceId);
          setErrorMsg("");
        } else {
          setBrioDeviceId("");
          setErrorMsg("Vui lòng rút thẻ ra để bắt đầu nhận diện khuôn mặt.");
        }
      } catch {
        setErrorMsg("Không thể truy cập danh sách thiết bị camera.");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 📸 Hàm chụp
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

  // ▶️ Khi người dùng nhấn nút "Chụp ảnh"
  const handleCapture = async () => {
    if (!brioDeviceId) {
      setErrorMsg("Không tìm thấy camera. Vui lòng rút thẻ ra.");
      return;
    }

    // Đợi 4 giây để camera ổn định, rồi bắt đầu đếm ngược
    setWaiting(true);
    setErrorMsg("");
    setTimeout(() => {
      setWaiting(false);
      setCountdown(6); // Đếm 6 giây cho người dùng chỉnh tư thế
      setIsCapturing(true);
    }, 4000);
  };

  // ⏳ Đếm ngược rồi chụp
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
      <h2 className="text-lg font-semibold text-gray-700">
        Rút thẻ, đợi hiện hình ảnh, rồi nhấn "Chụp ảnh"
      </h2>

      {errorMsg && <div className="text-red-600">{errorMsg}</div>}

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

          {/* Overlay vùng giữa */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div
              className="absolute top-0 left-0 h-full bg-black/50"
              style={{ width: "33.3333%" }}
            />
            <div
              className="absolute top-0 right-0 h-full bg-black/50"
              style={{ width: "33.3333%" }}
            />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Thông báo */}
      {waiting && <div className="text-blue-600 loading-dots">Đang khởi động camera</div>}
      {isCapturing && countdown !== null && (
        <div className="text-xl font-bold text-green-600">Chụp sau {countdown}s...</div>
      )}

      {/* Nút chụp */}
      <button
        onClick={handleCapture}
        disabled={waiting || isCapturing || !brioDeviceId}
        className={`px-4 py-2 rounded text-white ${
          waiting || isCapturing || !brioDeviceId
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {waiting
          ? "Đang khởi động..."
          : isCapturing
          ? "Đang chụp..."
          : brioDeviceId
          ? "Chụp ảnh"
          : "Đợi camera..."}
      </button>

      <button
        className="mt-2 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => navigate("/mer")}
      >
        Quay lại
      </button>
    </div>
  );
}
