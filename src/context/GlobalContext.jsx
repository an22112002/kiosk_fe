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
  const [npInfo, setNpInfo] = useState(null);
  const [paymentState, setPaymentState] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);

  const setFlowAsync = (value) => {
    return new Promise((resolve) => {
        setFlow(value);
        setTimeout(() => resolve(value), 0);
    });
  };

  const setPaymentStateAsync = (value) => {
    return new Promise((resolve) => {
        setPaymentState(value);
        setTimeout(() => resolve(value), 0);
    });
  };

  const resetGlobal = () => {
    setStateStep(1);
    setFlow("");
    setSelectedService("");
    setPatientInfo(INITIAL_INFO);
    setNpInfo(null);
    setPaymentState("")
    setPaymentInfo(null);
  };

  const logGlobal = () => {
    console.log("stateStep", stateStep);
    console.log("flow", flow);
    console.log("selectedService", selectedService);
    console.log("patientInfo", patientInfo);
    console.log("npInfo", npInfo);
    console.log("paymentState", paymentState);
    console.log("paymentInfo", paymentInfo);
  }

  return (
    <GlobalContext.Provider
      value={{
        stateStep,
        setStateStep,
        patientInfo, 
        setPatientInfo,
        flow, 
        setFlow,
        setFlowAsync,
        selectedService,
        setSelectedService,
        npInfo, 
        setNpInfo,
        paymentInfo,
        setPaymentInfo,
        paymentState, 
        setPaymentState,
        setPaymentStateAsync,
        resetGlobal,
        logGlobal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);