import React, { useState, useEffect } from 'react'
import axios from "axios";
import '../general-journal/style.css';


export const FinancialStatement = () => {

    const [tablesIdName, setTablesIdName] = useState([]);
    const [tablesIdAmount, setTablesIdAmount] = useState([]);
    // let assets = [], liabilities = [], ownerCapital = [], let ownerWithdrawl = [];
    let revenues = [], expenses = [];
    let OEAmount = 0, OWAmount = 0, Net = 0, OETotal = 0;

    useEffect(() => {
        const fetchTablesInfo = async () => {
            await axios.get('http://localhost:3000/financial-statement')
                .then(response => {
                    setTablesIdName(response.data[0]);
                    setTablesIdAmount(response.data[1]);
                })
                .catch(err => console.log(err));
        }
        fetchTablesInfo();
    }, []);


    const splitVaues = () => {
        // 100s asset - 200s liability - 300 OE - 400 OW - 500s Revenue - 600s Expense
        // assets = tablesIdName.filter(element => element.tableId < 200);
        // liabilities = tablesIdName.filter(element => element.tableId >= 200 && element.tableId < 300);
        // ownerCapital = tablesIdName.filter(element => element.tableId == 300);
        // ownerWithdrawl = tablesIdName.filter(element => element.tableId == 400);
        revenues = tablesIdName.filter(element => element.tableId >= 500 && element.tableId < 600);
        expenses = tablesIdName.filter(element => element.tableId >= 600);

        OEAmount = fetchAmount(300, 400);
        OWAmount = fetchAmount(400);
        Net = totalAmount(500, 600) - totalAmount(600, 700);
        OETotal = OEAmount + Net - OWAmount;
    }

    const fetchAmount = (dataTableId) => {
        let amount = 0;
        tablesIdAmount.map(item => {
            if (dataTableId === item.tableId) {
                amount = item.amount;
            }
        })
        return (amount);
    }


    const displayTable = (data, index) => {
        return (
            <tr key={index}>
                <td>{data.tableId}</td>
                <td>{data.name}</td>
                <td>{fetchAmount(data.tableId)}</td>
            </tr>
        )
    }


    const totalAmount = (start, end) => {
        let total = 0;
        tablesIdAmount.map(item => {
            if (item.tableId >= start && item.tableId < end) {
                total += item.amount;
            }
        })
        return (total);
    }

    const finalCalculation = (start, end) => {
        return (
            <tr>
                <td><em>Total</em></td>
                <td></td>
                <td><em>{totalAmount(start, end)}</em></td>
            </tr>
        )
    }

    return (
        <div className="m-5">
            <h1>Financial Statement</h1>
            <h4>Income Statement</h4>
            {splitVaues()}
            {/* Revenues */}
            <div className="erc20-cont">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Revenues</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Account Code</th>
                            <th>Account Title</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {revenues.map((item, index) => {
                            return displayTable(item, index);
                        })}
                        {finalCalculation(500, 600)}
                    </tbody>
                </table>
            </div>
            {/* Expenses */}
            <div className="erc20-cont">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Expenses</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Account Code</th>
                            <th>Account Title</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((item, index) => {
                            return displayTable(item, index);
                        })}
                        {finalCalculation(600, 700)}
                    </tbody>
                </table>
            </div>



            <h3>Owner Equity</h3>
            <div className="erc20-cont">
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <td>Begining balance of Owner Capital</td>
                            {/* <td>{fetchAmount(300)}</td> */}
                            <td>{OEAmount}</td>
                        </tr>
                        <tr>
                            <td>Net</td>
                            {/* <td>{totalAmount(500, 600) - totalAmount(600, 700)}</td> */}
                            <td>{(Net > 0) ? (Net) : `(${Math.abs(Net)})` }</td>
                        </tr>
                        <tr>
                            <td>Owner Withdrawl</td>
                            {/* <td>{fetchAmount(300)}</td> */}
                            <td>({OWAmount})</td>
                        </tr>
                        <tr>
                            <td><em>Total</em></td>
                            <td><em>{OETotal}</em></td>
                        </tr>
                    </tbody>
                </table>
            </div>



            <h3>Balance Sheet</h3>
            <div className="erc20-cont">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Assets (A) =</th>
                            <th>Liabilities (L) + Owner Equity (OE) </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {totalAmount(100, 200)}
                            </td>
                            <td>
                                {totalAmount(200, 300) + OETotal}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}
