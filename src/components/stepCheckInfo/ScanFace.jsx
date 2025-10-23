import Webcam from "react-webcam"
import { useRef } from "react";

export default function ScanFace() {
    const webcamRef = useRef(null);

    return (
        <>
            <div className="flex flex-col items-center gap-3">
                <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded-lg w-full"
                videoConstraints={{
                    width: 480,
                    height: 360,
                    facingMode: "user",
                }}
                />
            </div>
        </>
    )
}