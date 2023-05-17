import React, { useState, useEffect } from 'react'
import './../../account-types.json'
import { notify } from "../utils/error-box";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";
import '../landing/style.css';
import { alignProperty } from '@mui/material/styles/cssUtils';

export const CreateAccount = (props) => {
    const [accountType, setAccountType] = useState({
        accountType: "assets",
        accountName: "",
    });

    const updateInput = async (name, value) => {
        let data = Object.assign([], accountType);
        if (typeof name === "object") {
          data = { ...data, ...name };
        } else {
          data[name] = value;
        }

        console.log("data", data);
        setAccountType(data);
    };
    
    useEffect (() => {
        console.log(accountType);
    }, [accountType])

    function onSubmit() {
        // check if account name is empty or undefined notify error
        if (accountType.accountName === undefined || accountType.accountName === "") {
            notify("error", "Account name is required");
        }

        console.log(accountType.accountType);
        
        // check if account type is empty or undefined notify error
        if (accountType.accountType === undefined || accountType.accountType === "") {
            notify("error", "Account type is required");
        }

        const sendData = async () => {
            try {
                const res = await fetch("http://localhost:3000/createAccount", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accountType: accountType.accountType,
                        accountName: accountType.accountName,
                        accountTypesReference: props.accountTypes
                    })
                });

                // const json = await res.json();
                // const json = JSON.parse(await res.json());
                // setTables(json);
                console.log("status :: ", res.status);
                if (res.status == 200) {
                    notify("success", "Transactions inserted successfully");
                } else {
                    notify("error", "Transactions inserted unsuccessfully");
                }
            } catch (error) {
                console.log(error);
            }
        };
        sendData();
    }
    return (
        <div className='create-account-body'>
        <h1>Create Account</h1>
        <div className="cont">
            <div className="inner-cont">
                <div className="form-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Account Type</th>
                                <th>Account Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td className="w-25">
                                <FormControl className="textfield MuiTextField-root mb-3">
                                    <Select
                                    className="textfield"
                                    onChange={(e) => updateInput("accountType", e.target.value)}
                                    variant="standard"
                                    required
                                    displayEmpty
                                    value={accountType.accountType}
                                    sx={{ maxWidth: '100%' }}
                                    >
                                    {Object.keys(props.accountTypes).map((key) => (
                                        <MenuItem key={key} value={key} name={key}>
                                        {key}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                </td>

                                <td>
                                    <TextField
                                        placeholder='Example: Cash'
                                        onChange={(e) => updateInput("accountName", e.target.value)}
                                        className="textfield"
                                        variant="standard"
                                        required
                                        sx={{ maxWidth: '100%' }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="cont d-flex gap-2 mt-2">
            <button
            onClick={onSubmit}
            className="btn btn-info p-3 text-white w-100 button"
            >
            Submit
            </button>
        </div>
        </div>
    )
}