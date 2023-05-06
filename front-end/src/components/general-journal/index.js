import React, { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import './style.css';
import { notify } from "../utils/error-box";
import "react-toastify/dist/ReactToastify.css";

// const form = [{
//     flag : 'N',
//     account : 101,
//     description : '',
//     debitTransaction : false,
//     creditTransaction : false,
//     debitAmount : 0,
//     creditAmount : 0,
// }]

export const GeneralJournal = () => {
    const [debitTransactions, setDebitTransactions] = useState([{ 
        flag : 'N', 
        account : "", 
        description : '', 
        debitTransaction : false,
        debitAmount : 0
    }]);

    const [creditTransactions, setCreditTransactions] = useState([{ 
        flag : 'N', 
        account : "", 
        description : '',  
        creditTransaction : false,
        creditAmount : 0
    }]);

    const [tables, setTables] = useState([]);

    useEffect (() => {
        console.log(debitTransactions);
    }, [debitTransactions])

    useEffect (() => {
        console.log(creditTransactions);
    }, [creditTransactions])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/fetchTables", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const json = await res.json();
                // const json = JSON.parse(await res.json());
                setTables(json);
                console.log("pop", json);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    // useEffect (() => {
    //     console.log("tables :: ", tables);
    //     console.log(typeof(tables));
    // }, [tables])

    // on submit check if sum debit == sum credit
    function submit() {
        // check for type
        const amountRe = /^\d{1,10}(\.\d{1,2})?$/;
        const descriptionRe = /^[a-zA-Z0-9 ]{0,50}$/;
        let AmountFlag = false, DescriptionFlag = false, AccountFlag = false;
        let creditAmount = 0, debitAmount = 0;
        for (let index = 0; index < creditTransactions.length; index++) {
            const element = creditTransactions[index];
            !amountRe.test(parseFloat(element.creditAmount)) ? AmountFlag = true : creditAmount += parseFloat(element.creditAmount)
            if (!descriptionRe.test(element.description)) (DescriptionFlag = true)
            if (element.account === "" || element.account === undefined) (AccountFlag = true)
            if (AmountFlag && DescriptionFlag && AccountFlag) {break}
        }
        for (let index = 0; index < debitTransactions.length; index++) {
            const element = debitTransactions[index];
            // check amount 
            !amountRe.test(parseFloat(element.debitAmount)) ? AmountFlag = true : debitAmount += parseFloat(element.debitAmount)
            if (!descriptionRe.test(element.description)) (DescriptionFlag = true)
            if (element.account === "" || element.account === undefined) (AccountFlag = true)
            if (AmountFlag && DescriptionFlag && AccountFlag) {break}
        }
        if (AmountFlag) {notify("error", 'Invalid Amount, decimals must not exceed 2 digits & integers must not exceed 10 digits')};
        if (DescriptionFlag) {notify("error", 'description cannot exceed 50 characters with no special characters')};
        if (AccountFlag) {notify("error", 'Choose an account for all your transactions')};
        // check if credit amount and debit amount are equal
        if (creditAmount !== debitAmount) {notify("error", 'Debit & Credit amount must be equal')}
    }

    const updateDebitTransactionList = async (index, name, value) => {
        let data = Object.assign([], debitTransactions);
        if (typeof name === "object") {
          data[index] = { ...data[index], ...name };
        } else if (name === 'debitAmount') {
            data[index]['debitTransaction'] = true
            // data[index][name] = parseFloat(value);
            data[index][name] = value;
        } else {
          data[index][name] = value;
        }

        console.log("data", data);
        setDebitTransactions(data);
    };

    const updateCreditTransactionList = async (index, name, value) => {
        let data = Object.assign([], creditTransactions);
        if (typeof name === "object") {
          data[index] = { ...data[index], ...name };
        } else if (name === 'creditAmount') {
            data[index]['creditTransaction'] = true;
            // data[index][name] = parseFloat(value);
            data[index][name] = value;
        }else {
          data[index][name] = value;
        }

        console.log("data", data);
        setCreditTransactions(data);
    };

    const removeDebitRow = (i) => {
        const newTransactions = [...debitTransactions];
        if (newTransactions.length == 1) {return}
        newTransactions.splice(i, 1);
        setDebitTransactions(newTransactions);
    };

    const removeCreditRow = (i) => {
        const newTransactions = [...creditTransactions];
        if (newTransactions.length == 1) {return}
        newTransactions.splice(i, 1);
        setCreditTransactions(newTransactions);
    };

    const addDebitRow = (e) => {
        if (debitTransactions.length == 3 || creditTransactions.length > 1) {return}
        setDebitTransactions([...debitTransactions, {
            flag: 'N',
            account: 301,
            description: '',
            debitTransaction: false,
            debitAmount: 0
        }]);
    };

    const addCreditRow = (e) => {
        if (creditTransactions.length == 3 || debitTransactions.length > 1) {return}
        setCreditTransactions([...creditTransactions, {
            flag: 'N',
            account: 301,
            description: '',
            creditTransaction: false,
            creditAmount: 0
        }]);
    };

    const debitTokenRow = (data, index) => {
        return (
        <tr key={index}>
            <td>
            <button
                className="btn text-danger fa fa-remove"
                onClick={(e) => removeDebitRow(index)}
            ></button>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.flag}
                onChange={(e) => updateDebitTransactionList(index, "flag", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Flag"
                >
                <MenuItem value="A" name='ADJ'>Adjustment</MenuItem>
                <MenuItem value="C" name='CLO'>Closing</MenuItem>
                <MenuItem value="N" name='NOR'>Normal</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.account}
                onChange={(e) => updateDebitTransactionList(index, "account", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Account"
                >
                {/* <MenuItem value="101" name='101'>101</MenuItem>
                <MenuItem value="102" name='102'>102</MenuItem>
                <MenuItem value="103" name='103'>103</MenuItem> */}
                {
                    Object.values(tables).map(({ tableId, name }) => (
                        <MenuItem key={tableId} value={tableId} name={tableId}>{`${tableId} - ${name}`}</MenuItem>
                      ))
                }
                </Select>
            </FormControl>
            </td>
            <td>
            <TextField
                value={data?.description}
                onChange={(e) => updateDebitTransactionList(index, "description", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
            <td>
            <TextField
                value={data?.debitAmount}
                onChange={(e) => updateDebitTransactionList(index, "debitAmount", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
        </tr>
        );
    };

    const creditTokenRow = (data, index) => {
        return (
        <tr key={index}>
            <td>
            <button
                className="btn text-danger fa fa-remove"
                onClick={(e) => removeCreditRow(index)}
            ></button>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.flag}
                onChange={(e) => updateCreditTransactionList(index, "flag", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Flag"
                >
                <MenuItem value="A" name='ADJ'>Adjustment</MenuItem>
                <MenuItem value="C" name='CLO'>Closing</MenuItem>
                <MenuItem value="N" name='NOR'>Normal</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.account}
                onChange={(e) => updateCreditTransactionList(index, "account", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Account"
                >
                {/* <MenuItem value="101" name='101'>101</MenuItem>
                <MenuItem value="102" name='102'>102</MenuItem>
                <MenuItem value="103" name='103'>103</MenuItem> */}
                {
                    Object.values(tables).map(({ tableId, name }) => (
                        <MenuItem key={tableId} value={tableId} name={tableId}>{`${tableId} - ${name}`}</MenuItem>
                      ))
                }
                </Select>
            </FormControl>
            </td>
            <td>
            <TextField
                value={data?.description}
                onChange={(e) => updateCreditTransactionList(index, "description", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
            <td>
            <TextField
                value={data?.creditAmount}
                onChange={(e) => updateCreditTransactionList(index, "creditAmount", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
        </tr>
        );
    };

    return (
        <>
            <div className="content">
            <div className="erc20-cont">
                <div className="erc20-inner-cont">
                {/* <h2 className="erc20-">Create your ERC1155 token</h2> */}
                <div className="erc20-">
                    <table className="table table-bordered">
                    <thead>
                        <tr>
                        <th>
                            <button
                            className="btn text-success fa fa-plus-circle"
                            onClick={addDebitRow}
                            ></button>
                        </th>
                        <th>Flag</th>
                        <th>Account</th>
                        <th>description</th>
                        <th>Debit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debitTransactions.map((item, index) => {return debitTokenRow(item, index);})}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            <div className="erc20-cont">
                <div className="erc20-inner-cont">
                <div className="erc20-">
                    <table className="table table-bordered">
                    <thead>
                        <tr>
                        <th>
                            <button
                            className="btn text-success fa fa-plus-circle"
                            onClick={addCreditRow}
                            ></button>
                        </th>
                        <th>Flag</th>
                        <th>Account</th>
                        <th>description</th>
                        <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditTransactions.map((item, index) => {return creditTokenRow(item, index);})}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            <div className="erc20-cont d-flex gap-2 mt-2">
              <button
                onClick={submit}
                className="btn btn-info p-3 text-white w-100"
              >
                Submit
              </button>
              </div>
            </div>
            {/* <div className="d-flex gap-2 mt-2">
              <button
                onClick={submit}
                className="btn btn-info p-3 text-white w-100"
              >
                Create Your Token
              </button>
              </div> */}
        </>
    );
}