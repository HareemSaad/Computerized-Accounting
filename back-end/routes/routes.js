const express = require('express');
const {fetchTables} = require('./../scripts/fetchTables');
const {insertData} = require('./../scripts/insertData');

const trialBalance = require('./../scripts/trialBalance.js');

const mysql = require('mysql');
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
});


const router = express.Router();

router.post("/fetchTables", fetchTables);
router.post("/insertTxns", insertData);

// TRIAL BALANCE GET METHOD
router.get('/trial-balance', async (req, res) => {
  // const q1 = "SELECT tableId, name FROM Heads;SELECT `100`.`debit` AS debit, `100`.`credit` AS credit, `100`.`amount` AS amount FROM `100` JOIN `GeneralJournal` ON `100`.`transactionId` = `GeneralJournal`.`transactionId`";
  
  const q1 = "SELECT tableId, name FROM Heads";
  
  const dataArr = [];
  const AllTablesId = [];
  // const data2 = await trialBalance.allTablesId();
  // dataArr.push(data2);
  // console.log(data2);
  
  connection.query(q1, async (err, data) => {
    if (err) console.log(err);
    else {
      dataArr.push(data);
      data.forEach(element => {
        AllTablesId.push(element.tableId);
        // console.log(element.tableId);
      });
      const data2 = await trialBalance.allTablesId(AllTablesId);
      dataArr.push(data2);

      // console.log(data);
      res.send(dataArr);
      console.log("data sent");
    };
  });

});

module.exports = {
    routes: router
  }   
  