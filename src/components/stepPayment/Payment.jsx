import { useGlobal } from "../../context/GlobalContext"
import { useEffect, useState } from "react"
import ChoosePayment from "./ChoosePayment"
import ShowQR from "./ShowQR"

export default function PaymentLayout() {
    const { setStateStep } = useGlobal()
    const [step, setStep] = useState(1);

    useEffect(() => {
        setStateStep(3)
    }, [setStateStep])

    const nextStep = () => setStep(2);

    return (
        <>
            {step === 1 
            ? (<ChoosePayment onNext={ nextStep }></ChoosePayment>) 
            : (<ShowQR></ShowQR>)}
        </>
    )
}