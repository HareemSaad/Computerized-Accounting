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

export const GeneralJournal = (props) => {
    const [debitTransactions, setDebitTransactions] = useState([{
        account : "",
        debitTransaction : false,
        debitAmount : 0
    }]);

    const [creditTransactions, setCreditTransactions] = useState([{ 
        account : "", 
        creditTransaction : false,
        creditAmount : 0
    }]);

    const [tables, setTables] = useState([]);
    const [txnFlag, setTxnFlag] = useState('N');
    const [description, setDescription] = useState('');

    useEffect (() => {
        console.log(debitTransactions);
    }, [debitTransactions])

    useEffect (() => {
        console.log(creditTransactions);
    }, [creditTransactions])

    useEffect (() => {
        console.log(txnFlag);
    }, [txnFlag])

    useEffect (() => {
        console.log(description);
    }, [description])

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

    function hasDuplicates(array) {
        return array.length !== new Set(array).size;
    }

    // useEffect (() => {
    //     console.log("tables :: ", tables);
    //     console.log(typeof(tables));
    // }, [tables])

    // on submit check if sum debit == sum credit
    function submit(event) {
        let button = event.target;
        console.log(button);
        button.classList.add('disabled');
        setTimeout(function() {
        button.classList.remove('disabled');
        }, 10000); // 10000 milliseconds = 10 seconds

        let tableIds = []
        creditTransactions.forEach(element => {
            tableIds.push(element.account)
        });
        debitTransactions.forEach(element => {
            tableIds.push(element.account)
        });

        console.log("table ids from front-end :: ", tableIds);

        // check for type
        const amountRe = /^\d{1,10}(\.\d{1,2})?$/;
        const descriptionRe = /^[a-zA-Z0-9 ]{0,50}$/;
        let AmountFlag = false, DescriptionFlag = false, AccountFlag = false, duplicateFlag = false;
        let creditAmount = 0, debitAmount = 0;
        // let initialTxnFlag = debitTransactions[0].flag

        // check if same account is used in any transaction
        if (hasDuplicates(tableIds)) {
            duplicateFlag = true;
            notify("error", "duplicate accounts")
        }

        // check for decsription
        if (!descriptionRe.test(description)) (DescriptionFlag = true)

        //check in credit transactions
        for (let index = 0; index < creditTransactions.length; index++) {
            const element = creditTransactions[index];
            !amountRe.test(parseFloat(element.creditAmount)) ? AmountFlag = true : creditAmount += parseFloat(element.creditAmount)
            if (element.account === "" || element.account === undefined) (AccountFlag = true)
            if (AccountFlag && AmountFlag) {break}
        }
        for (let index = 0; index < debitTransactions.length; index++) {
            const element = debitTransactions[index];
            // check amount 
            !amountRe.test(parseFloat(element.debitAmount)) ? AmountFlag = true : debitAmount += parseFloat(element.debitAmount)
            if (element.account === "" || element.account === undefined) (AccountFlag = true)
            if (AccountFlag && AmountFlag) {break}
        }
        if (AmountFlag) {notify("error", 'Invalid Amount, decimals must not exceed 2 digits & integers must not exceed 10 digits')};
        if (DescriptionFlag) {notify("error", 'description cannot exceed 50 characters with no special characters')};
        if (AccountFlag) {notify("error", 'Choose an account for all your transactions')};
        // if (TxnFlag) {notify("error", 'All transactions must have the same flag')};
        // check if credit amount and debit amount are equal
        if (creditAmount !== debitAmount) {notify("error", 'Debit & Credit amount must be equal')}
        console.log('ct :: ', creditTransactions);
        console.log('dt :: ', debitTransactions);
        // split to separate transactions done at the backend
        console.log("json", JSON.stringify({
            creditTransactions: creditTransactions,
            debitTransactions: debitTransactions,
            description: description,
            txnFlag: txnFlag,
            accountWeight: props.accountWeight
          }));
        const sendData = async () => {
            try {
                const res = await fetch("http://localhost:3000/insertTxns", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        creditTransactions: creditTransactions,
                        debitTransactions: debitTransactions,
                        description: description,
                        txnFlag: txnFlag,
                        accountWeight: props.accountWeight,
                        tableIds: tableIds
                    })
                });

                // const json = await res.json();
                // const json = JSON.parse(await res.json());
                // setTables(json);
                console.log("status :: ", res.status);
                if (res.status == 200) {
                    notify("success", "Transactions inserted successfully");
                } else if (res.status == 401) {
                    notify("error", "Account Overflow");
                } else {
                    notify("error", "Transactions inserted unsuccessfully");
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (AmountFlag || AccountFlag || DescriptionFlag || (creditAmount !== debitAmount) || duplicateFlag) {
            notify("error", 'Unable to send transactions due to errors')
        } else {
            sendData();
        }
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
            account: 301,
            debitTransaction: false,
            debitAmount: 0
        }]);
    };

    const addCreditRow = (e) => {
        if (creditTransactions.length == 3 || debitTransactions.length > 1) {return}
        setCreditTransactions([...creditTransactions, {
            account: 301,
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
                value={data?.account}
                onChange={(e) => updateDebitTransactionList(index, "account", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Account"
                >
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

    const general = () => {
        return (
        <tr>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={txnFlag}
                onChange={(e) => setTxnFlag(e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Flag"
                >
                <MenuItem value="A" name='ADJ'>Adjustment</MenuItem>
                <MenuItem value="N" name='NOR'>Normal</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td>
            <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <div className="cont">
                    <div className="inner-cont">
                    <div className="form-body">
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                            <th>Flag</th>
                            <th>description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {general()}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
                <div className="transaction-body">
                    <div className="cont side-margin">
                        <div className="inner-cont">
                        <div className="form-body">
                            <table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>
                                    <button
                                    className="btn text-success fa fa-plus-circle"
                                    onClick={addDebitRow}
                                    ></button>
                                </th>
                                <th>Account</th>
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
                    <div className="cont">
                        <div className="inner-cont">
                        <div className="form-body">
                            <table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>
                                    <button
                                    className="btn text-success fa fa-plus-circle"
                                    onClick={addCreditRow}
                                    ></button>
                                </th>
                                <th>Account</th>
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
                </div>
                <div className="cont d-flex gap-2 mt-2">
                <button
                    onClick={submit}
                    className="btn btn-info p-3 text-white w-100 button"
                >
                    Submit
                </button>
                </div>
            </div>
        </>
    );
}