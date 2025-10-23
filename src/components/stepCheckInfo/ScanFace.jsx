import React, { useEffect, useRef, useState } from "react";

export default function ScanFace({ setImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(6);

  // Lấy danh sách camera
  useEffect(() => {
    async function getDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (err) {
        console.warn("Không lấy được quyền camera:", err);
      }

      const all = await navigator.mediaDevices.enumerateDevices();
      const vids = all.filter((d) => d.kind === "videoinput");
      setDevices(vids);

      // chọn camera mặc định nếu chưa chọn
      if (vids.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(vids[0].deviceId);
      }
    }

    getDevices();

    // cập nhật khi thay đổi thiết bị
    const handleDeviceChange = () => getDevices();
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      stopStream();
    };
  }, []);

  // Bắt đầu stream khi chọn thiết bị
  useEffect(() => {
    async function start() {
      if (!selectedDeviceId) return;
      stopStream();
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
      } catch (err) {
        console.error("Không bật được camera:", err);
      }
    }
    start();
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
    setImage(dataUrl); //  Gửi ảnh ra ngoài
    stopStream();
  }

  // Tự động đếm ngược 6 giây để chụp
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

      {/* chọn camera nếu có nhiều thiết bị */}
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

      <div className="relative border rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-lg w-[480px] h-auto bg-black"
        />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="flex gap-4 mt-3">
        <button
          onClick={stopStream}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Tắt camera
        </button>
      </div>
    </div>
  );
}
