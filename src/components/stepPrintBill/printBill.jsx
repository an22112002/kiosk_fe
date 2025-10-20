import { useGlobal } from "../../context/GlobalContext"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useReactToPrint } from "react-to-print";

export default function PrintBill() {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const navigate = useNavigate()
    const { setState, flow } = useGlobal()

    useEffect(() => {
        if (flow == "insur") {
            setState(3)
        }
        setState(4)
    }, [setState, flow])

    useEffect(() => {
		reactToPrintFn();
	}, []);

    const backHomePage = () => {
        navigate("/")
    }

    return (
        <>
            <div className="mt-auto min-h-20 w-full mb-[7px]">
				<div className="flex items-center w-full h-full px-12 gap-10 py-4">
					<button
                    className="p-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-400 border border-gray-200 transition-colors duration-200"
                    onClick={backHomePage}
                    >Chở lại trang chủ
                    </button>
				</div>
			</div>
        </>
    )
}