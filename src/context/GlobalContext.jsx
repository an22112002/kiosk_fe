import { createContext, useState, useContext } from "react";
import { INITIAL_INFO } from "../utils/constants/default" ;

// Tạo context
const GlobalContext = createContext();

// Provider
export const GlobalProvider = ({ children }) => {
 // Các state
  const [stateStep, setStateStep] = useState(1);
  const [flow, setFlow] = useState("");
  const [identifyType, setIdentifyType] = useState("");
  const [patientID, setPatientID] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [patientInfo, setPatientInfo] = useState(INITIAL_INFO);
  const [npInfo, setNpInfo] = useState(null);
  const [paymentState, setPaymentState] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isNewInsurPatient, setIsNewInsurPatient] = useState(false)

  const setFlowAsync = (value) => {
    return new Promise((resolve) => {
        setFlow(value);
        setTimeout(() => resolve(value), 0);
    });
  };

  const setIdentifyTypeAsync = (value) => {
    return new Promise((resolve) => {
        setIdentifyType(value);
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
    setIdentifyType("");
    setPatientID("");
    setSelectedService("");
    setPatientInfo(INITIAL_INFO);
    setNpInfo(null);
    setPaymentState("");
    setPaymentInfo(null);
    setIsNewInsurPatient(false);
  };

  const logGlobal = () => {
    console.log("stateStep", stateStep);
    console.log("flow", flow);
    console.log("identify type", identifyType);
    console.log("patientID", patientID);
    console.log("selectedService", selectedService);
    console.log("patientInfo", patientInfo);
    console.log("npInfo", npInfo);
    console.log("paymentState", paymentState);
    console.log("paymentInfo", paymentInfo);
    console.log("newInsurPatient", isNewInsurPatient);
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
        identifyType, 
        setIdentifyType,
        setIdentifyTypeAsync,
        patientID,
        setPatientID,
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
        isNewInsurPatient,
        setIsNewInsurPatient,
        logGlobal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);