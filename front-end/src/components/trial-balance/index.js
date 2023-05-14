import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../general-journal/style.css';


export const TrialBalance = () => {
  // create use state
  const [tablesNameId, setTablesNameId] = useState([]);
  const [tablesInfo, setTableInfo] = useState([]);

  // create use effect
  useEffect(() => {
    const fetchTablesName = async () => {
      await axios.get('http://localhost:3000/trial-balance')
        .then(response => {
          setTableInfo(response.data[0]);
          setTablesNameId(response.data[1]);
        })
        //.then(response => console.log(response.data[0]))
        .catch(err => console.log(err));
    }
    fetchTablesName();
  }, []);


  const displayTable = (data, index) => {
    return (

      <tr key={index}>
        <td>{data.tableId}</td>
        <td>{data.name}</td>
        <td>{tablesInfo[index].debit}</td>
        <td>{tablesInfo[index].credit}</td>
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
          </tbody>
        </table>
      </div>


    </div >
  )
}
