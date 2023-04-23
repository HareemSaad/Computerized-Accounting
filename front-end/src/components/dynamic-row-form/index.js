// import React, { useState, useEffect } from "react";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Tooltip from "@mui/material/Tooltip";
// import './style.css';

// //row1/item1

// //[{[{}]}]

// const rows = [
//     {
//         [
//             {
//                 type: 'Select',
//                 menuItems: [
//                     {
//                         value: true,
//                         text: 'Nft'
//                     },
//                     {
//                         value: true,
//                         text: 'Nft'
//                     }
//                 ],
//             },
//             {
//                 type: 'Textfield',
//                 value: 'value'
//             }
//         ]

//     }
// ]

// export function DynamicForm () {
//     const removeRow = (i) => {
//         let data = Object.assign({}, formData);
//         delete data.tokens.splice(i, 1);
//         setFormData(data);
//     };

//     const tokenRow = (data, index) => {
//         return (
//           <tr>
//             <td>
//               <button
//                 className="btn text-danger fa fa-remove"
//                 onClick={(e) => removeRow(index)}
//               ></button>
//             </td>
//             <td className="w-25">
//               <FormControl className="textfield MuiTextField-root mb-3">
//                 <Select
//                   value={data?.type}
//                   onChange={(e) => updateToken(index, "type", e.target.value)}
//                   className="textfield"
//                   variant="standard"
//                   required
//                   label="Type"
//                 >
//                   <MenuItem value="true">NFT</MenuItem>
//                   <MenuItem value="false">Fungible Token</MenuItem>
//                 </Select>
//               </FormControl>
//             </td>
//             <td>
//               <TextField
//                 value={data?.name}
//                 onChange={(e) => updateToken(index, "name", e.target.value)}
//                 className="textfield"
//                 variant="standard"
//                 required
//               />
//             </td>
//             <td>
//               <TextField
//                 value={data?.id}
//                 onChange={(e) => updateToken(index, "id", e.target.value)}
//                 className="textfield"
//                 variant="standard"
//                 required
//               />
//             </td>
//             <td>
//               <TextField
//                 value={data?.supply}
//                 onChange={(e) => updateToken(index, "supply", e.target.value)}
//                 className="textfield"
//                 variant="standard"
//                 required
//               />
//             </td>
//           </tr>
//         );
//       };
// }