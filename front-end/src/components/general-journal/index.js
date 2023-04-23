import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import './style.css';
// const useStyles = makeStyles((theme) => ({
//     root: {
//       "& > *": {
//         margin: theme.spacing(1),
//         width: "500px",
//       },
//     },
//   }
// ));

const initial = [{
    flag : '',
    account : '',
    decription : '',
    debit : '',
}]
  
export const GeneralJournal = () => {
    // const classes = useStyles();
    // const history = useHistory();

    // const [store, dispatch] = useStore();
    // const [apiRes, setApiRes] = useState();
    const [formData, setFormData] = useState({
        tokens: [{ type: true, name: "", id: "", supply: 1 }],
        uri: "",

        network: null,
        ownable: false,
        mintable: false,
        burnable: false,
        access_control: false,
    });

    console.log(formData);
    // const nextStep = () => {
    //     if (formData?.tokens?.find((data) => data.name === "")) {
    //     notify("error", "Token Name is required");
    //     return false;
    //     }
    //     if (formData?.tokens?.find((data) => data.id === "")) {
    //     notify("error", "Token Id is required");
    //     return false;
    //     }
    //     if (formData?.tokens?.find((data) => data.supply < 1)) {
    //     notify("error", "Token supply must be greater or equal to 1");
    //     return false;
    //     }
    //     if (formData?.uri === "") {
    //     notify("error", "Token URI is not defined.");
    //     return false;
    //     }
    //     if (formData?.symbol === "") {
    //     notify("error", "Token Symbol is required");
    //     return false;
    //     }
    //     if (formData?.supply === "") {
    //     notify("error", "Token Supply is required");
    //     return false;
    //     }
    //     if (formData?.decimal === "") {
    //     notify("error", "Token Decimal is required");
    //     return false;
    //     }
    //     TokenService.setToken(1155, formData);
    //     if (store.network === null) {
    //     history.push("/form/network");
    //     } else {
    //     history.push("/form/confirm");
    //     }
    // };

    const updateForm = async (name, value) => {
        let data = Object.assign({}, formData);
        if (typeof name === "object") {
        data = { ...data, ...name };
        } else {
        data[name] = value;
        }
        setFormData(data);
    };

    const updateToken = async (index, name, value) => {
        let data = Object.assign({}, formData);
        if (typeof name === "object") {
        data.tokens[index] = { ...data.tokens[index], ...name };
        } else {
        data.tokens[index][name] = value;
        }
        setFormData(data);
    };

    const removeRow = (i) => {
        let data = Object.assign({}, formData);
        delete data.tokens.splice(i, 1);
        setFormData(data);
    };

    const addRow = (e) => {
        let data = Object.assign({}, formData);
        data.tokens.push({ type: true, name: "", id: "", supply: 1 });
        setFormData(data);
    };

    // useEffect(() => {
    //     store.steps.push("form");
    //     handleStep(dispatch, store.steps);
    //     let data = {
    //     tokens: [{ type: true, name: "", id: "", supply: 1 }],
    //     uri: "",
    //     ownable: false,
    //     mintable: false,
    //     burnable: false,
    //     access_control: false,
    //     };

    //     setTimeout(() => {
    //     if (TokenService.tokenType === 1155) {
    //         data = TokenService.data;
    //         console.log(data, "data");
    //     }
    //     setFormData({
    //         tokens: data.tokens,
    //         uri: data.uri,
    //         ownable: data.ownable,
    //         mintable: data.mintable,
    //         burnable: data.burnable,
    //         network: store.network === null ? null : store.network,

    //         access_control: data.access_control,
    //     });
    //     }, 500);
    //     return () => {
    //     setFormData({
    //         tokens: [{ type: true, name: "", id: "", supply: 1 }],
    //         uri: "",
    //         ownable: false,
    //         mintable: false,
    //         burnable: false,
    //         access_control: false,
    //     });
    //     };
    // }, []);
    /*
        return (
            <div className="content">
                <Helmet>
                    <link rel="canonical" href={`${window.env.SITE_URL}form/erc1155`} />
                </Helmet>
                <div className="erc20-cont">
                    <h2 className="erc20-">ERC1155 is not available right now.</h2>
                </div>
            </div>
        );*/

    const tokenRow = (data, index) => {
        return (
        <tr>
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
                onChange={(e) => updateToken(index, "flag", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Flag"
                >
                <MenuItem value="A">Adjustment</MenuItem>
                <MenuItem value="C">Closing</MenuItem>
                <MenuItem value="N">Normal</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td className="w-25">
            <FormControl className="textfield MuiTextField-root mb-3">
                <Select
                value={data?.account}
                onChange={(e) => updateToken(index, "account", e.target.value)}
                className="textfield"
                variant="standard"
                required
                label="Account"
                >
                <MenuItem value="A" name='ADJ'>Adjustment</MenuItem>
                <MenuItem value="C" name='CLO'>Closing</MenuItem>
                <MenuItem value="N" name='NOR'>Normal</MenuItem>
                </Select>
            </FormControl>
            </td>
            <td>
            <TextField
                value={data?.description}
                onChange={(e) => updateToken(index, "description", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
            <td>
            <TextField
                value={data?.debit}
                onChange={(e) => updateToken(index, "debit", e.target.value)}
                className="textfield"
                variant="standard"
                required
            />
            </td>
        </tr>
        );
    };

    return (
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
                    {initial.map((item, index) => {return tokenRow(item, index);})}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    );
};
