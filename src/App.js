import { BrowserRouter, Routes, Route} from "react-router-dom"
import Layout from "./components/Layout";
import HomePage from "./page/Home";
import SelectMER from "./components/SelectMER";
import InsurLayout from "./components/Insur";
import CheckInfo from "./components/CheckInfo";
import NonInsurLayout from "./components/NonInsur";
import InsertPatient from "./components/InsertPatient";
import RegisterService from "./components/RegisterService";

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
          </Route>
          <Route path="new-patient" element={<InsertPatient />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
