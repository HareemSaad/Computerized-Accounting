const express = require('express');
const { fetchTables } = require('./../scripts/fetchTables');
const { insertData } = require('./../scripts/insertData');
const { createAccount } = require('./../scripts/createAccount');
const { closeAccount } = require('../scripts/closeAccount');
const cors = require('cors');
const trialBalance = require('./../scripts/trialBalance.js');
const financialStatement = require('./../scripts/financialStatement');

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
router.use(cors());

router.post("/fetchTables", fetchTables);
router.post("/insertTxns", insertData);
router.post("/createAccount", createAccount);
router.post("/closeAccount", closeAccount);


// TRIAL BALANCE GET METHOD
router.get('/trial-balance', async (req, res) => {
  // const q1 = "SELECT tableId, name FROM Heads;SELECT `100`.`debit` AS debit, `100`.`credit` AS credit, `100`.`amount` AS amount FROM `100` JOIN `GeneralJournal` ON `100`.`transactionId` = `GeneralJournal`.`transactionId`";

  // const q1 = "SELECT tableId, name FROM Heads";
  const q1 = "SELECT * FROM Heads";

  const dataArr = [];
  const AllTablesId = [];
  const AllTablesName = [];
  const AllTablesStartFromDate = [];
  // const data2 = await trialBalance.allTablesId();
  // dataArr.push(data2);
  // console.log(data2);

  connection.query(q1, async (err, data) => {
    if (err) console.log(err);
    else {
      // dataArr.push(data);
      data.forEach(element => {
        AllTablesId.push(element.tableId);
        AllTablesName.push(element.name);
        AllTablesStartFromDate.push(element.startFrom);
        // console.log(element);
      });
      // const data2 = await trialBalance.allTablesId(AllTablesId);
      const data2 = await trialBalance.calculateTrialBalance(AllTablesId, AllTablesName, AllTablesStartFromDate);
      // dataArr.push(data2);
      // console.log("data2: ", data2);
      // console.log("-------------------------------------");

      // console.log(data);
      res.send(data2);
      console.log("data sent");
    }
  });

});

router.get("/financial-statement", async (req, res) => {
  // const q = "SELECT tableId, name FROM Heads WHERE tableId >= 500 AND tableId < 600;SELECT tableId, name FROM Heads WHERE tableId >= 600";
  
  const dataArr = [];
  // const q = "SELECT tableId, name FROM Heads WHERE tableId >= 500";
  const q = "SELECT tableId, name FROM Heads";
  connection.query(q, async (err, data) => {
    if (err) console.log(err);
    dataArr.push(data);
    const data2 = await financialStatement.fetchIdTotalAmount();
    // const dataArr3 = await financialStatement.responseData(data, data2);
    dataArr.push(data2);
    res.send(dataArr);
  });
})

function convertDateFormat(dateString) {
  dateString = dateString.trim();
  const dateParts = dateString.split(/[/, ]+/);
  const year = dateParts[2];
  const month = dateParts[0] < 10 ? "0" + dateParts[0] : dateParts[0];
  const day = dateParts[1] < 10 ? "0" + dateParts[1] : dateParts[1];

  return `${year}-${month}-${day}`;
}


router.get("/view-general-journal", (req, res) => {
  // connection.query("SELECT * FROM GeneralJournal WHERE date = '2023-05-20'; SELECT tableId, name FROM Heads", async (err, data) => {
  const q = "SELECT startFrom FROM Heads WHERE tableId = 800";
  connection.query(q, (error, result) => {
    if (error) throw(error);
    else {
      const date = convertDateFormat(result[0].startFrom.toLocaleString());
      //const date = result[0].startFrom;
      // console.log(result[0].startFrom.toISOString().slice(0, 10));
      connection.query(`SELECT * FROM GeneralJournal WHERE date > '${date}'; SELECT tableId, name FROM Heads`, (err, data) => {
        if (err) console.log(err);
        res.send(data);
        console.log("data sent to view general journal");
      });
    }
  })
})

module.exports = {
  routes: router
}   
