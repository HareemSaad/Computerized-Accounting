import React, { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import './style.css';

// const form = [{
//     flag : 'N',
//     account : 101,
//     decription : '',
//     debitTransaction : false,
//     creditTransaction : false,
//     debitAmount : 0,
//     creditAmount : 0,
// }]

export const GeneralJournal = () => {
    const [transactions, setTransactions] = useState([{ 
        flag : 'N', 
        account : 101, 
        decription : '', 
        debitTransaction : false, 
        creditTransaction : false, 
        debitAmount : 0, 
        creditAmount : 0 
    }]);

    useEffect (() => {
        console.log(transactions);
    }, [transactions])

    // on submit check if sum debit == sum credit

    const updateTransactionList = async (index, name, value) => {
        let data = Object.assign([], transactions);
        if (typeof name === "object") {
          data[index] = { ...data[index], ...name };
        } else if (name === 'debitAmount') {
            data[index]['debitTransaction'] = true
            data[index][name] = parseFloat(value);
        } else if (name === 'creditAmount') {
            data[index]['creditTransaction'] = true;
            data[index][name] = parseFloat(value);
        }else {
          data[index][name] = value;
        }

        console.log("data", data);
        setTransactions(data);
      };

    const removeRow = (i) => {
        const newTransactions = [...transactions];
        if (newTransactions.length == 1) {return}
        newTransactions.splice(i, 1);
        setTransactions(newTransactions);
      };

    const addRow = (e) => {
        if (transactions.length == 3) {return}
        setTransactions([...transactions, {
            flag: 'N',
            account: 101,
            description: '',
            debitTransaction: false,
            creditTransaction: false,
            debitAmount: 0,
            creditAmount: 0
        }]);
    };

    const tokenRow = (data, index) => {
        return (
        <tr key={index}>
            <td>
            <button
                className="btn text-danger fa fa-remove"
                onClick={(e) => removeRow(index)}
            ></button>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.flag}
                onChange={(e) => updateTransactionList(index, "flag", e.target.value)}
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
                onChange={(e) => updateTransactionList(index, "account", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Account"
                >
                <MenuItem value="101" name='101'>101</MenuItem>
                <MenuItem value="102" name='102'>102</MenuItem>
                <MenuItem value="103" name='103'>103</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td>
            <TextField
                value={data?.description}
                onChange={(e) => updateTransactionList(index, "description", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
            <td>
            <TextField
                value={data?.debit}
                onChange={(e) => updateTransactionList(index, "debitAmount", e.target.value)}
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
                            onClick={addRow}
                            ></button>
                        </th>
                        <th>Flag</th>
                        <th>Account</th>
                        <th>Decription</th>
                        <th>Debit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item, index) => {return tokenRow(item, index);})}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            {/* <div className="erc20-cont">
                <div className="erc20-inner-cont">
                <div className="erc20-">
                    <table className="table table-bordered">
                    <thead>
                        <tr>
                        <th>
                            <button
                            className="btn text-success fa fa-plus-circle"
                            onClick={addRow}
                            ></button>
                        </th>
                        <th>Flag</th>
                        <th>Account</th>
                        <th>Decription</th>
                        <th>Debit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item, index) => {return tokenRow(item, index);})}
                    </tbody>
                    </table>
                </div>
                </div>
            </div> */}
            </div>
        </>
    );
}