import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);

  useEffect(() => {
    // Bật timer 10 giây để chụp ảnh
    const timer = setTimeout(() => {
      if (webcamRef.current) {
        const image = webcamRef.current.getScreenshot(); // base64
        setImage(image); // gọi callback để set state ở cha
      }
    }, 10000); // 10 giây

    return () => clearTimeout(timer);
  }, [setImage]);

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
        }}
      />
      <div className="mt-2 text-center text-lg font-semibold">
        Camera sẵn sàng
      </div>
    </div>
  );
}
