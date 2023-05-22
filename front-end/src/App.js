import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Route, Routes} from "react-router-dom";
import { GeneralJournal } from './components/general-journal';
import { TrialBalance } from './components/trial-balance';
import { FinancialStatement } from './components/financial-statement';
import { CreateAccount } from './components/create-account';
import { Landing } from './components/landing';
import { Closing } from './components/closing';
import { ViewGeneralJournal } from './components/view-general-journal';
import { ToastContainer } from "react-toastify";

function App() {

  const [accountTypes, setAccountTypes] = useState({
    "assets": 100,
    "liabilities": 200,
    "owner-capital": 300,
    "owner-withdrawal": 400,
    "revenue": 500,
    "expense": 600,
    "contra-assets": 700,
    "income-summary": 800
  })

  const [accountWeight, setAccountWeight] = useState({
    "100": 'debit',
    "200": 'credit',
    "300": 'credit',
    "400": 'debit',
    "500": 'credit',
    "600": 'debit',
    "700": 'credit',
    "800": ''
  })

  return (
    <>
      <ToastContainer />
      <Routes>
          <Route path="/" element={<Landing/>} /> 
          <Route path="/general-journal" element={<GeneralJournal accountWeight={accountWeight}/>} /> 
          <Route path="/trial-balance" element={<TrialBalance/>} /> 
          <Route path="/financial-statement" element={<FinancialStatement/>} /> 
          <Route path="/create-account" element={<CreateAccount accountTypes={accountTypes}/>} /> 
          <Route path="/view-general-journal" element={<ViewGeneralJournal/>} /> 
          <Route path="/closing" element={<Closing/>} /> 
      </Routes>
    </>
  );
}

export default App;
