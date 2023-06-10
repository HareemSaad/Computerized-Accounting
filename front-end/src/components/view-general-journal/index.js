import React, { useState, useEffect } from 'react'
import axios from "axios";


export const ViewGeneralJournal = () => {
    const [generalJournalInfo, setGeneralJournalInfo] = useState([]);
    const [tableNameId, setTableNameId] = useState([]);
    var tableNameIdMap = new Map();

    useEffect(() => {
        const fetchTablesInfo = async () => {
            await axios.get('http://localhost:3000/view-general-journal')
                .then(response => {
                    setGeneralJournalInfo(response.data[0]);
                    setTableNameId(response.data[1]);
                    console.log(response.data);
                })
                .catch(err => console.log(err));
        }
        fetchTablesInfo();
    }, []);

    
    // insert value of tableNameId in tableNameIdMap
    const insertMap = () => {
        tableNameId.map((item, index) => {
            tableNameIdMap.set(item.tableId, item.name);
            // console.log("item: ", item);
        });
    }
    // console.log("tableNameIdMap: ", tableNameIdMap);


    const displayTable = (data, index) => {
        return (

            <tr key={index}>
                <td>{data.transactionId}</td>
                <td>{data.date.slice(0, 10)}</td>
                <td>{data.flag}</td>
                <td>{data.description}</td>
                <td>{`${tableNameIdMap.get(data.debitAccount)} (${data.debitAccount})`}</td>
                <td>{`${tableNameIdMap.get(data.creditAccount)} (${data.creditAccount})`}</td>
                <td>{data.amount}</td>
            </tr>

        )
    }

    return (
        <div className=''>
            <h1>General Journal</h1>
            <div className="cont">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Flag</th>
                            <th>Description</th>
                            <th>Debit Account</th>
                            <th>Credit Account</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insertMap()}
                        {generalJournalInfo.map((item, index) => {
                            return displayTable(item, index);
                        })}
                    </tbody>
                </table>
            </div>


        </div>
    )
}
