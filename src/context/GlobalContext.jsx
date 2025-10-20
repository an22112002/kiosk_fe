import { createContext, useState, useContext } from "react";
import { INITIAL_INFO, NEW_PATIENT_INFO } from "../utils/constants/default" ;

// Tạo context
const GlobalContext = createContext();

// Provider
export const GlobalProvider = ({ children }) => {
 // Các state
  const [stateStep, setStateStep] = useState(1);
  const [flow, setFlow] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [patientInfo, setPatientInfo] = useState(INITIAL_INFO);
  const [npInfo, setNpInfo] = useState(NEW_PATIENT_INFO);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const resetGlobal = () => {
    setStateStep(1);
    setFlow("");
    setSelectedService("");
    setPatientInfo(INITIAL_INFO);
    setNpInfo(INITIAL_INFO);
    setPaymentInfo(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        stateStep,
        setStateStep,
        patientInfo, 
        setPatientInfo,
        flow, 
        setFlow,
        selectedService,
        setSelectedService,
        npInfo, 
        setNpInfo,
        paymentInfo,
        setPaymentInfo,
        resetGlobal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);