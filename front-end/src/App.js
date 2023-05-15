import logo from './logo.svg';
import './App.css';
import { Route, Routes} from "react-router-dom";
import { GeneralJournal } from './components/general-journal';
import { TrialBalance } from './components/trial-balance';
import { FinancialStatement } from './components/financial-statement';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
          <Route path="/" element={<GeneralJournal/>} /> 
          <Route path="/trial-balance" element={<TrialBalance/>} /> 
          <Route path="/financial-statement" element={<FinancialStatement/>} /> 

          {/* <Route path="/letter-keyboard" element={<Game1/>} />
          <Route path="/number-pops" element={<Game2/>} /> */}
      </Routes>
    </>
  );
}

export default App;
