import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { notify } from "../utils/error-box";
import "react-toastify/dist/ReactToastify.css";
import '../landing/style.css';

export const Landing = (props) => {

    let navigate = useNavigate();

    const [card, setCard] = useState([]);
  
    useEffect(() => {
      const cards = ["General Journal", "Trial Balance", "Financial Statements", "Create T-Accounts", "View T-Accounts"];
      setCard(cards)
    }, []);

    const handleClick = (card) => {
        console.log(card);
        if (card === 'General Journal') {navigate('/general-journal')}
        else if (card === 'Trial Balance') {navigate('/trial-balance')}
        else if (card === 'Financial Statements') {navigate('/financial-statement')}
        else if (card === 'Create T-Accounts') {navigate('/create-account')}
        // else if (card === 'Financial Statements') {navigate('/financial-statement')}
        else {notify("error", "Route doesn't exist")}
    };
  
    return (
      <>
      <h1 className='landing-heading'>Options</h1>
      <div className="card-container">
          {card.map((card, index) => (
            <div className="card" key={`${index}`}>
              <h2 className='case-heading'>{card}</h2>
              <button className="card-btn" onClick={() => handleClick(card)}>View</button>
            </div>
          ))}
      </div>
      </>
    )
  }