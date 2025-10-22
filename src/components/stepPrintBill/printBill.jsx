import { useGlobal } from "../../context/GlobalContext"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useReactToPrint } from "react-to-print"
import { Helmet } from "react-helmet-async"
import InfoPrint from "./infoPrint"

export default function PrintBill() {
    const contentRef = useRef(null)
    const navigate = useNavigate()
    const { setStateStep, flow } = useGlobal()
    const [countDown, setCountDown] = useState(30)

    const reactToPrintFn = useReactToPrint({ contentRef });

    // Bước theo flow
    useEffect(() => {
        setStateStep(flow === "insur" ? 3 : 4)
    }, [setStateStep, flow])

    
    // Auto print chỉ 1 lần, đảm bảo ref đã mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                reactToPrintFn();
            }
        }, 3000); // đợi 3 giây

        return () => clearTimeout(timer);
    }, [])

    // Countdown
    useEffect(() => {
        if (countDown <= 0) {
            navigate("/")
            return
        }
        const timer = setTimeout(() => setCountDown(prev => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [countDown, navigate])

    return (
        <>
            <Helmet>
                <title>In phiếu</title>
            </Helmet>
            {/* Nội dung in ẩn */}
            <div style={{ position: "absolute", left: 0, top: 0, visibility: "hidden" }}>
                <div ref={contentRef}>
                    <InfoPrint />
                </div>
            </div>

            {/* Giao diện hiển thị */}
            <div className="mt-auto min-h-20 w-full mb-[7px] flex flex-col items-center justify-center px-12 py-4 gap-4">
                <InfoPrint />

                <button
                    className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                    onClick={() => navigate("/")}
                >
                    Trở lại trang chủ
                </button>

                <h2 className="text-lg text-gray-700 font-medium">
                    Tự chuyển hướng sau{" "}
                    <span className="text-red-500 font-semibold">{countDown}s</span>
                </h2>
            </div>
        </>
    )
}
