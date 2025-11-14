import CCCDInfoDisplay from "./CCCDInfoDisplay"
import VNeIDInfoDisplay from "./VNeIDInfoDisplay"
import { useGlobal } from "../../context/GlobalContext"

export default function PatientInfoDisplay({ patientInfo, npInfo, flow }) {
  const { identifyType } = useGlobal()
  return (
    <>
      {identifyType === "cccd" ? <CCCDInfoDisplay patientInfo={patientInfo} npInfo={npInfo} flow={flow}></CCCDInfoDisplay>
       : <VNeIDInfoDisplay patientInfo={patientInfo} npInfo={npInfo} flow={flow}></VNeIDInfoDisplay>}
    </>
  )
}