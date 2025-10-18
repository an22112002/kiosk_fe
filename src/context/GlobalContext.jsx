import { createContext, useState, useContext } from "react";
import { INITIAL_INFO } from "../utils/constants/default" ;

// Tạo context
const GlobalContext = createContext();

// Provider
export const GlobalProvider = ({ children }) => {
 // Các state
  const [stateStep, setStateStep] = useState(1);
  const [flow, setFlow] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [patientInfo, setPatientInfo] = useState(INITIAL_INFO);

  const resetGlobal = () => {
    setStateStep(1);
    setFlow("");
    setSelectedService("");
    setPatientInfo(INITIAL_INFO);
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
        resetGlobal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);