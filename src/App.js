import { BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./components/layout/Layout";
import HomePage from "./page/Home";
import SelectMER from "./components/layout/SelectMER";
import InsurLayout from "./components/layout/Insur";
import CheckInfo from "./components/stepCheckInfo/CheckInfo";
import NonInsurLayout from "./components/layout/NonInsur";
import InsertPatient from "./components/registerNewPatient/InsertPatient";
import RegisterService from "./components/stepChooseService/RegisterService";
import PaymentLayout from "./components/stepPayment/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />}></Route>
          {/* <Route path="search" element={<SearchPage />}></Route> */}
        </Route>
        {/* đăng ký khám */}
        <Route path="/mer" element={<Layout />}>
          <Route index element={<SelectMER />}></Route>
          {/* luồng có bảo hiểm */}
          <Route path="insur" element={<InsurLayout />}>
            <Route path="checkPatient" element={<CheckInfo />}></Route>
            <Route path="register" element={<RegisterService />}></Route>
          </Route>
          {/* luồng không có bảo hiểm */}
          <Route path="non-insur" element={<NonInsurLayout />}>
            <Route path="checkPatient" element={<CheckInfo />}></Route>
            <Route path="register" element={<RegisterService />}></Route>
            <Route path="payment" element={<PaymentLayout />}></Route>
          </Route>
          <Route path="new-patient" element={<InsertPatient />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
