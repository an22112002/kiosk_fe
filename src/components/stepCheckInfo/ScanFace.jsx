import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    // Bật timer 6 giây để chụp ảnh
    const timer = setTimeout(() => {
      if (webcamRef.current) {
        const image = webcamRef.current.getScreenshot(); // base64
        setImage(image); // gọi callback để set state ở cha
      }
    }, 6000); // 6 giây

    return () => clearTimeout(timer);
  }, [setImage]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(d => d.kind === "videoinput");
      setDevices(videoDevices);
      // chọn camera Brio 500 theo label
      const brio = videoDevices.find(d => d.label.toLowerCase().includes("brio"));
      if (brio) setDeviceId(brio.deviceId);
      else if (videoDevices.length) setDeviceId(videoDevices[0].deviceId);
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-lg w-full"
        videoConstraints={{
          width: 480,
          height: 360,
          deviceId: deviceId || undefined,
        }}
      />
      <div className="mt-2 text-center text-lg font-semibold">
        {deviceId ? "Camera sẵn sàng" : "Đang tìm camera..."}
      </div>
    </div>
  );
}
