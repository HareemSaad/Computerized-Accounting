import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../general-journal/style.css';


export const TrialBalance = () => {
  // create use state
  const [tablesNameId, setTablesNameId] = useState([]);
  const [tablesDebitCredit, setTablesDebitCredit] = useState([]);

  // create use effect
  useEffect(() => {
    const fetchTablesInfo = async () => {
      await axios.get('http://localhost:3000/trial-balance')
        .then(response => {
          setTablesNameId(response.data[0]);
          setTablesDebitCredit(response.data[1]);
        })
        //.then(response => console.log(response.data[0]))
        .catch(err => console.log(err));
    }
    fetchTablesInfo();
  }, []);


  const displayTable = (data, index) => {
    return (

      <tr key={index}>
        <td>{data.tableId}</td>
        <td>{data.name}</td>
        <td>{tablesDebitCredit[index].debit}</td>
        <td>{tablesDebitCredit[index].credit}</td>
      </tr>

    )
  }

  const calculateFinalDebitCredit = () => {
    let debit = 0, credit = 0;
    tablesDebitCredit.map((data, index) => {
      if (data.debit > 0) {
        debit += data.debit;
      }
      if (data.credit > 0) {
        credit += data.credit;
      }
    })
    return { debit, credit };
  }

  const finalCalculation = () => {
    return (
      <tr>
        <td></td>
        <td></td>
        <td>{calculateFinalDebitCredit().debit}</td>
        <td>{calculateFinalDebitCredit().credit}</td>
      </tr>
    )
  }


  return (
    <div className="content">
      <h1>Trial Balance</h1>
      <div className="erc20-cont">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Account Name</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {tablesNameId.map((item, index) => {
              return displayTable(item, index);
            })}
            {finalCalculation()}
          </tbody>
        </table>
      </div>


    </div >
  )
}
