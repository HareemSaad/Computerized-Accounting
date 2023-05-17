import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { Route, Routes} from "react-router-dom";
import { GeneralJournal } from './components/general-journal';
import { TrialBalance } from './components/trial-balance';
import { FinancialStatement } from './components/financial-statement';
import { CreateAccount } from './components/create-account';
import { Landing } from './components/landing';
import { ToastContainer } from "react-toastify";

function App() {

  const [accountTypes, setAccountTypes] = useState({
    "assets": 100,
    "liabilities": 200,
    "owner-capital": 300,
    "owner-withdrawal": 400,
    "revenue": 500,
    "expense": 600,
    "contra-assets": 700
  })

  const [accountWeight, setAccountWeight] = useState({
    "assets": 'debit',
    "liabilities": 'credit',
    "owner-capital": 'credit',
    "owner-withdrawal": 'debit',
    "revenue": 'credit',
    "expense": 'debit',
    "contra-assets": 'credit'
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
      </Routes>
    </>
  );
}

export default App;
