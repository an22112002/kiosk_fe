import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScanFace({ setImage }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(6);
  const [permissionStatus, setPermissionStatus] = useState("checking"); // 'granted', 'denied', 'prompt'
  const [errorMsg, setErrorMsg] = useState(""); // thông báo lỗi camera

  // Kiểm tra quyền camera
  useEffect(() => {
    async function checkPermission() {
      if (!navigator.permissions) {
        console.warn("Trình duyệt không hỗ trợ API permissions.");
        await requestCamera();
        return;
      }

      try {
        const status = await navigator.permissions.query({ name: "camera" });
        setPermissionStatus(status.state);

        status.onchange = () => {
          setPermissionStatus(status.state);
        };

        if (status.state === "granted") {
          await getDevices();
        } else if (status.state === "prompt") {
          await requestCamera();
        } else if (status.state === "denied") {
          alert("⚠️ Trình duyệt đang chặn quyền camera. Hãy vào Cài đặt > Quyền riêng tư > Cho phép camera.");
        }
      } catch (err) {
        console.warn("Không thể kiểm tra quyền camera:", err);
        await requestCamera();
      }
    }

    checkPermission();

    return () => stopStream();
  }, []);

  // Xin quyền camera nếu chưa có
  async function requestCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      s.getTracks().forEach((t) => t.stop());
      await getDevices();
    } catch (err) {
      console.error("Không thể truy cập camera:", err);
      alert("Không thể truy cập camera. Vui lòng cho phép quyền trong trình duyệt.");
    }
  }

  // Lấy danh sách camera
  async function getDevices() {
    const all = await navigator.mediaDevices.enumerateDevices();
    const vids = all.filter((d) => d.kind === "videoinput");
    setDevices(vids);
    if (vids.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(vids[0].deviceId);
    }
  }

  // Khởi động camera
  async function startCamera() {
    if (!selectedDeviceId) return;
    stopStream();
    setErrorMsg("");

    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play().catch(() => {});
      }
      setCountdown(6);
    } catch (err) {
      console.error("Không bật được camera:", err);
      setErrorMsg(
        `Không thể bật camera. Có thể thiết bị đang được ứng dụng khác sử dụng (VD: Video.UI). Vui lòng tắt các ứng dụng khác và thử lại.`
      );
    }
  }

  // Tự động start khi đổi camera
  useEffect(() => {
    startCamera();
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  // Dừng camera
  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Chụp ảnh
  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setImage(dataUrl); // gửi ảnh ra ngoài
    stopStream();
  }

  // Countdown
  useEffect(() => {
    if (!stream) return;
    if (countdown === 0) {
      capture();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, stream]);

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">
        Vui lòng nhìn thẳng vào camera
      </h2>

      {permissionStatus === "denied" && (
        <div className="text-red-600 text-sm">
          Trình duyệt không cho phép truy cập camera. Hãy bật lại quyền trong phần cài đặt.
        </div>
      )}
      {permissionStatus === "prompt" && (
        <div className="text-yellow-600 text-sm">
          Hệ thống đang yêu cầu quyền camera, vui lòng chấp nhận.
        </div>
      )}

      {errorMsg && (
        <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
      )}

      {permissionStatus === "granted" && (
        <>
          <select
            className="border rounded px-3 py-1 mb-3"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${d.deviceId}`}
              </option>
            ))}
          </select>

          <div className="flex gap-2 mb-2">
            {errorMsg && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={startCamera}
              >
                Thử lại
              </button>
            )}
          </div>

          <div className="relative border rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-lg w-[480px] h-auto bg-black"
            />
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              {countdown > 0 ? `Chụp sau ${countdown}s` : "Đang chụp..."}
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="flex gap-4 mt-3">
        <button
          onClick={() => navigate("/mer")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
