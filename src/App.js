import { BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./components/layout/Layout";
import Access from "./components/layout/Access";
import HomePage from "./page/Home";
import SelectMER from "./components/layout/SelectMER";
import InsurLayout from "./components/layout/Insur";
import CheckInfo from "./components/stepCheckInfo/CheckInfo";
import NonInsurLayout from "./components/layout/NonInsur";
import RegisterService from "./components/stepChooseService/RegisterService";
import PaymentLayout from "./components/stepPayment/Payment";
import PrintBill from "./components/stepPrintBill/printBill";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Access />}></Route>
          <Route path="homepage" element={<HomePage />}></Route>
          {/* <Route path="search" element={<SearchPage />}></Route> */}
        </Route>
        {/* đăng ký khám */}
        <Route path="/mer" element={<Layout />}>
          <Route index element={<SelectMER />}></Route>
          <Route path="" element={<SelectMER />}></Route>
          {/* luồng có bảo hiểm */}
          <Route path="insur" element={<InsurLayout />}>
            <Route path="checkPatient" element={<CheckInfo />}></Route>
            <Route path="register" element={<RegisterService />}></Route>
            <Route path="print-bill" element={<PrintBill />}></Route>
          </Route>
          {/* luồng không có bảo hiểm */}
          <Route path="non-insur" element={<NonInsurLayout />}>
            <Route path="checkPatient" element={<CheckInfo />}></Route>
            <Route path="register" element={<RegisterService />}></Route>
            <Route path="payment" element={<PaymentLayout />}></Route>
            <Route path="print-bill" element={<PrintBill />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
