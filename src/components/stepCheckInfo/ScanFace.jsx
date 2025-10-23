import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";

export default function ScanFace({ setImage }) {
  const webcamRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    // Lấy danh sách camera
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const cameras = devices.filter(d => d.kind === "videoinput");
      console.log("Danh sách camera:", cameras);

      // Lấy camera mong muốn (theo tên)
      const preferredCam = cameras.find(c => c.label.includes("Brio 500"));

      // Nếu tìm thấy, đặt deviceId
      if (preferredCam) {
        setDeviceId(preferredCam.deviceId);
        localStorage.setItem("preferredCamId", preferredCam.deviceId);
      } else if (cameras.length > 0) {
        // nếu không tìm thấy thì dùng camera đầu tiên
        setDeviceId(cameras[0].deviceId);
      }
    });
  }, []);

  useEffect(() => {
    // Bật timer 10 giây để chụp ảnh
    const timer = setTimeout(() => {
      if (webcamRef.current) {
        const image = webcamRef.current.getScreenshot();
        setImage(image);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [setImage]);

  // Nếu chưa có deviceId thì chưa render webcam (tránh lỗi)
  if (!deviceId) return <div>Đang khởi tạo camera...</div>;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="mt-2 text-center text-lg font-semibold">
        Xác thực khuôn mặt
      </div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-lg w-full"
        videoConstraints={{
          width: 480,
          height: 360,
          deviceId: deviceId ? { exact: deviceId } : undefined,
        }}
      />
      <div className="mt-2 text-center text-lg font-semibold">
        Đứng yên và quay mặt vào camera
      </div>
    </div>
  );
}

// import Webcam from "react-webcam";
// import { useRef, useEffect } from "react";

// export default function ScanFace({ setImage }) {
//   const webcamRef = useRef(null);

//   useEffect(() => {
//     // Bật timer 10 giây để chụp ảnh
//     const timer = setTimeout(() => {
//       if (webcamRef.current) {
//         const image = webcamRef.current.getScreenshot(); // base64
//         setImage(image); // gọi callback để set state ở cha
//       }
//     }, 10000); // 10 giây

//     return () => clearTimeout(timer);
//   }, [setImage]);

//   return (
//     <div className="flex flex-col items-center gap-3">
//         <div className="mt-2 text-center text-lg font-semibold">
//             Xác thực khuôn mặt
//         </div>
//         <Webcam
//             ref={webcamRef}
//             audio={false}
//             screenshotFormat="image/jpeg"
//             className="rounded-lg w-full"
//             videoConstraints={{
//             width: 480,
//             height: 360,
//             }}
//         />
//         <div className="mt-2 text-center text-lg font-semibold">
//             Đứng yên và quay mặt vào camera
//         </div>
//     </div>
//   );
// }
