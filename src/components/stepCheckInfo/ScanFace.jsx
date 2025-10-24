import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function ScanFace({ setImage }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [brioDeviceId, setBrioDeviceId] = useState("");
  const [countdown, setCountdown] = useState(7);
  const [errorMsg, setErrorMsg] = useState("");
  const [checking, setChecking] = useState(true);
  const [webcamReady, setWebcamReady] = useState(false);

  // Kiểm tra Brio 500
  const checkBrio = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const brio = devices.find(
        d => d.kind === "videoinput" && d.label.toLowerCase().includes("brio")
      );
      if (brio) {
        setBrioDeviceId(brio.deviceId);
        setErrorMsg("");
        setChecking(false);
      } else {
        setBrioDeviceId("");
        setErrorMsg("Vui lòng rút thẻ ra để bắt đầu nhận diện khuôn mặt.");
        setChecking(true);
      }
    } catch {
      setErrorMsg("Không thể lấy danh sách camera.");
      setChecking(true);
    }
  };

  // Liên tục kiểm tra Brio 500
  useEffect(() => {
    const interval = setInterval(checkBrio, 2000);
    return () => clearInterval(interval);
  }, []);

  // Dừng stream cũ
  useEffect(() => {
    if (webcamRef.current?.stream) {
      webcamRef.current.stream.getTracks().forEach(t => t.stop());
    }
  }, [brioDeviceId]);

  // Capture phần giữa 1/3 chiều rộng
  const capture = () => {
    if (!webcamRef.current || !canvasRef.current) return;
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const cropW = w / 3;
    const cropX = (w - cropW) / 2;

    canvas.width = cropW;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, cropX, 0, cropW, h, 0, 0, cropW, h);

    setImage(canvas.toDataURL("image/jpeg"));
  };

  // Countdown tự động, chỉ chạy khi webcamReady
  useEffect(() => {
    if (!brioDeviceId || !webcamReady) return; // CHỈ đếm khi webcam sẵn sàng
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, brioDeviceId, webcamReady]);

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Vui lòng nhìn thẳng vào camera phía trên
      </h2>

      {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}

      {brioDeviceId && (
        <div className="relative border rounded-lg overflow-hidden w-[480px] h-[360px]">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-full h-full"
            onUserMedia={() => setWebcamReady(true)}
            onUserMediaError={() => {
              setWebcamReady(false)
              setErrorMsg(
                "Không thể bật camera. Có thể đang được ứng dụng khác sử dụng."
              );
              setChecking(true);
            }}
            videoConstraints={{
              width: 480,
              height: 360,
              deviceId: { exact: brioDeviceId },
            }}
          />

          {/* Overlay gạch gạch 2 bên */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 left-0 h-full bg-black/50" style={{ width: "33.3333%" }} />
            <div className="absolute top-0 right-0 h-full bg-black/50" style={{ width: "33.3333%" }} />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {checking && !brioDeviceId && (
        <div className="mt-2 text-center text-lg font-semibold text-yellow-700">
          Vui lòng rút thẻ ra để bắt đầu nhận diện khuôn mặt...
        </div>
      )}

      {brioDeviceId && !checking && (
        <div className="mt-2 text-center text-lg font-semibold">
          Camera sẵn sàng - chụp sau {countdown}s
        </div>
      )}

      <button
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate("/mer")}
      >
        Quay lại
      </button>

    </div>
  );
}
