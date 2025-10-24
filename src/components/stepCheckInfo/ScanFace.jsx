import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [brioDeviceId, setBrioDeviceId] = useState("");
  const [countdown, setCountdown] = useState(null); // null: chưa bắt đầu
  const [errorMsg, setErrorMsg] = useState("");
  const [webcamReady, setWebcamReady] = useState(false);
  const [waitingForCamera, setWaitingForCamera] = useState(false);

  // 🔍 Kiểm tra Brio 500 định kỳ
  const checkBrio = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const brio = devices.find(
        d => d.kind === "videoinput" && d.label.toLowerCase().includes("brio")
      );
      if (brio) {
        setBrioDeviceId(brio.deviceId);
        setErrorMsg("");
      } else {
        setBrioDeviceId("");
        setErrorMsg("Vui lòng rút thẻ ra để bắt đầu nhận diện khuôn mặt.");
      }
    } catch {
      setErrorMsg("Không thể lấy danh sách camera.");
    }
  };

  useEffect(() => {
    checkBrio();
    const interval = setInterval(checkBrio, 2000);
    return () => clearInterval(interval);
  }, []);

  // Dừng stream cũ khi đổi camera
  useEffect(() => {
    if (webcamRef.current?.stream) {
      webcamRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setWebcamReady(false);
  }, [brioDeviceId]);

  // Hàm chụp phần giữa 1/3 ảnh
  const capture = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0)
      return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const cropW = w / 3;
    const cropX = (w - cropW) / 2;

    canvas.width = cropW;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, cropX, 0, cropW, h, 0, 0, cropW, h);
    setImage(canvas.toDataURL("image/jpeg"));
  };

  // ⏱ Đếm ngược tự động
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      capture();
      setCountdown(null);
      setWaitingForCamera(false);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Khi nhấn “Chụp ảnh”
  const handleStartCapture = async () => {
    if (!brioDeviceId) {
      setErrorMsg("Vui lòng rút thẻ ra để bắt đầu nhận diện khuôn mặt. Rồi ấn lại nút.");
      return;
    }

    setErrorMsg("");
    setWaitingForCamera(true);

    // đợi 4 giây để cam có hình ảnh
    setTimeout(() => {
      const video = webcamRef.current?.video;
      if (video?.videoWidth > 0 && video?.videoHeight > 0) {
        setWebcamReady(true);
        setCountdown(7);
      } else {
        setErrorMsg("Không thể lấy hình ảnh từ camera. Thử lại.");
        setWaitingForCamera(false);
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Nhấn Chụp ảnh rồi nhìn vào camera phía trên
      </h2>

      {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

      {brioDeviceId && (
        <div className="relative border rounded-lg overflow-hidden w-[480px] h-[360px]">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-full h-full"
            onUserMedia={() => setWebcamReady(true)}
            onUserMediaError={() =>
              setErrorMsg(
                "Không thể bật camera Brio 500. Có thể đang được ứng dụng khác sử dụng."
              )
            }
            videoConstraints={{
              width: 480,
              height: 360,
              deviceId: { exact: brioDeviceId },
            }}
          />

          {/* Overlay gạch gạch 2 bên */}
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

      {/* Hiển thị trạng thái */}
      {waitingForCamera && (
        <div className="mt-2 text-blue-600 font-medium">
          Đang khởi động camera, vui lòng giữ nguyên trong 4 giây...
        </div>
      )}

      {countdown !== null && webcamReady && (
        <div className="mt-2 text-lg font-semibold">
          Chụp sau {countdown}s...
        </div>
      )}

      {/* Nút chụp */}
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleStartCapture}
        disabled={waitingForCamera || countdown !== null}
      >
        {waitingForCamera
          ? "Đang khởi động..."
          : countdown !== null
          ? "Đang chụp..."
          : "Chụp ảnh"}
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
