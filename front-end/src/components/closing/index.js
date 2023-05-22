import React, { useState, useEffect } from 'react'
import axios from "axios";
import { notify } from "../utils/error-box";
import "react-toastify/dist/ReactToastify.css";

export const Closing = () => {

  const onSubmit = (event) => {
    let button = event.target;
    console.log("button: ", button);
    button.classList.add('disabled');
    setTimeout(function () {
      button.classList.remove('disabled');
    }, 10000); // 10000 milliseconds = 10 seconds

    const sendData = () => {
      axios.post("http://localhost:3000/closeAccount")
        .then(response => {
          console.log("response.status: ", response.status);

          (response.status == 200) ? notify("success", "Accounts are closed successfully") : notify("error", "Accounts closure is unsuccessful");
        })
        .catch(error => {
          console.log(error);
        })
    }
    sendData();
  }


  return (
    <div className='content'>
      <h1>Close Accounts</h1>
      <h5 className="mt-2 mb-4">Are you sure you want to close accounts?</h5>
      <div className="cont d-flex gap-2 mt-2">
        <button
          onClick={onSubmit}
          className="btn btn-info p-3 text-white w-100 button">
          Close Accounts
        </button>
      </div>
    </div>
  )
}
