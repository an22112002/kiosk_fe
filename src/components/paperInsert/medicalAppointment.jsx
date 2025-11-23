"Giấy hẹn khám lại"
import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import Input from "antd/es/input/Input";
import { openNotification } from "../../utils/helpers";

export default function MedicalAppointmentForm({ onBack, paperType }) {
    const [ inputText, setInputText ] = useState("")

    const handleDone = () => {
        if (inputText.length < 10 ) {
            openNotification("Lỗi nhập liệu", "Bạn phải nhập đủ thông tin", "warning")
        } else {
            onBack(`${inputText}`)
        }
    }

    const handleKeyboardInput = (input) => {
        let text = inputText;

        if (input === "{bksp}") {
            text = text.slice(0, -1);
        } else if (text.length < 10) {
            text += input;
        }

        setInputText(text);
    };

    return (
        <>
            <div className="flex flex-col items-center gap-[10px] mt-6 mb-6 w-full">
            <h1 className="text-[1.5rem] text-blue-700"><strong>XIN NHẬP MÃ BỆNH NHÂN TRÊN {paperType}</strong></h1>
            <Input value={inputText} placeholder="VD: 002498329838" className="w-[65%] text-[1.7rem] text-center" readOnly></Input>
            <div className="w-[65%]">
                <Keyboard className="h-[1000px]"
                    layout={{
                    default: [
                        "1 2 3",
                        "4 5 6",
                        "7 8 9",
                        "0 {bksp}",
                    ],
                    }}
                    display={{
                    "{bksp}": "⌫",
                    }}
                    onKeyPress={handleKeyboardInput}
                />
            </div>
            <button
                className="text-[25px] hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer px-5 py-2 font-semibold bg-gradient-to-r from-colorTwo to-colorFive text-white rounded-xl hover:from-green-500 hover:to-emerald-600 disabled:opacity-50"
                onClick={handleDone}>
                TIẾP THEO
            </button>
            </div>
        </>
    )
}