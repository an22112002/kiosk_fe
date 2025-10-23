import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    async function initCamera() {
      try {
        // Gọi quyền truy cập camera
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");

        console.log("Danh sách camera:", videoDevices);

        // Ưu tiên chọn camera Brio 500
        let targetCam = videoDevices.find((d) =>
          d.label.toLowerCase().includes("brio 500")
        );

        // Nếu không có, lấy camera đầu tiên
        if (!targetCam && videoDevices.length > 0)
          targetCam = videoDevices[0];

        if (targetCam) {
          setDeviceId(targetCam.deviceId);
          console.log("Đang dùng camera:", targetCam.label);
        } else {
          console.warn("Không tìm thấy camera phù hợp!");
        }
      } catch (err) {
        console.error("Lỗi truy cập camera:", err);
      }
    }

    initCamera();
  }, []);

  // Tự động chụp sau 10 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      if (webcamRef.current) {
        const image = webcamRef.current.getScreenshot();
        setImage(image);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [setImage]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="mt-2 text-center text-lg font-semibold">
        Xác thực khuôn mặt
      </div>

      {deviceId ? (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-lg w-full"
          videoConstraints={{
            width: 480,
            height: 360,
            deviceId,
          }}
        />
      ) : (
        <div>Đang khởi tạo camera...</div>
      )}

      <div className="mt-2 text-center text-lg font-semibold">
        Đứng yên và quay mặt vào camera
      </div>
    </div>
  );
}
