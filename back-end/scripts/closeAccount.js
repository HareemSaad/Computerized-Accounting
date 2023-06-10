const mysql = require('mysql');
const dotenv = require('dotenv').config();
const fetchTables = require('./fetchTables');
const trialBalance = require('./trialBalance');
const axios = require('axios');

// Establishing connection
const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


const sendReqBody = async (creditTableId, debitTableId, amount, closingAccount) => {
  const accountWeight = {
    '100': 'debit',
    '200': 'credit',
    '300': 'credit',
    '400': 'debit',
    '500': 'credit',
    '600': 'debit',
    '700': 'credit',
    '800': ''
  };

  const requestData = {
    creditTransactions: [{ account: creditTableId, creditTransaction: true, creditAmount: amount }],
    debitTransactions: [{ account: debitTableId, debitTransaction: true, debitAmount: amount }],
    description: `Close Account ${closingAccount}`,
    txnFlag: "C",
    accountWeight: accountWeight,
    tableIds: [creditTableId, debitTableId]
  };

  try {
    const response = await axios.post("http://localhost:3000/insertTxns", requestData);
    return response.status;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send request body');
  }
};

// closing revenue and expense account - inserting closing values against income summary
const insertClosingValues = async (result) => {
  const incomeSummaryAccountId = 800;
  const res = [];
  let incomeSummaryTotal = 0; // let incomeSummaryDebit = 0, incomeSummaryCredit = 0, incomeSummaryTotal2 = 0;
  console.log("result: ", result);
  try {
    updateStartFromDate(result);
    result.map(async (resultItem) => {
      if (resultItem.debit !== 0) {
        // expense - always on debit side; credit side no entry -> credit side = 0
        incomeSummaryTotal += resultItem.debit;
        // incomeSummaryDebit += resultItem.debit;
        {/*
        revenue:                    income summary
        debit  | credit           debit    | credit 
        100    | clo. 100         clo. 100 | 
      */}
        res.push(await sendReqBody(resultItem.tableId, incomeSummaryAccountId, resultItem.debit, resultItem.tableId));
      } else if (resultItem.credit !== 0) {
        // revenue - always on credit side; debit side no entry -> debit side = 0
        incomeSummaryTotal -= resultItem.credit;
        // incomeSummaryCredit += resultItem.credit;
        {/*
        expense:              income summary
        debit     | credit        debit | credit 
        clo. 1900 | 1900                | clo. 1900
      */}
        res.push(await sendReqBody(incomeSummaryAccountId, resultItem.tableId, resultItem.credit, resultItem.tableId));
      }
    })
    // incomeSummaryTotal2 = incomeSummaryDebit - incomeSummaryCredit;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to insert closing values');
  }

  return { incomeSummaryTotal, res };
};

// closing income summary and withdraw accounts
const closeIncomeWithdraw = async (account, ownerCapital, name) => {
  const res = [];
  
  
  try {
    if (account[0].debit !== 0) {
      // res.push(await sendReqBody(account[0].tableId, ownerCapital[0].tableId, account[0].debit, account[0].tableId));
      res.push(await sendReqBody(account[0].tableId, ownerCapital[0].tableId, account[0].debit, name));
    } else if (account[0].credit !== 0) {
      res.push(await sendReqBody(ownerCapital[0].tableId, account[0].tableId, account[0].credit, name));
    }
    updateStartFromDate(account);
    
    // let date = "2023-06-11";
    // let date = new Date().toISOString().slice(0, 10).replace('T', ' ');
    // const updateQuery = 'UPDATE Heads SET startFrom = ? WHERE tableId = ?';
    // await connection.query(updateQuery, [date, account[0].tableId]);
    
  } catch (error) {
    console.error(error);
    throw new Error('Failed to close income/withdrawal account');
  }

  return res;
};

const updateStartFromDate = (accountsArray) => {
  // console.log(tableStartFrom[0].toISOString().slice(0, 10));
  // UPDATE `Heads` SET `startFrom` = '2023-06-10' WHERE `Heads`.`tableId` = 800; 
  const date = "2023-06-15";
  // let date = new Date().toISOString().slice(0, 10).replace('T', ' ');
  accountsArray.map(async (item, index) => {
    const updateQuery = 'UPDATE Heads SET startFrom = ? WHERE tableId = ?';
    await connection.query(updateQuery, [date, item.tableId]);
  })
}

const closeAccount = async (req, res) => {
  console.log("In closeAccount");
  
  try {
    const headTablesInfo = await fetchTables.specificHeadTablesId(300, 700);
    console.log("headTablesInfo: ", headTablesInfo);
    const valuesObj = await trialBalance.calculateTrialBalance(headTablesInfo.tablesId, "", headTablesInfo.tableStartFrom);
    const ownerCapital = valuesObj.filter(element => element.tableId == 300);
    const ownerWithdrawl = valuesObj.filter(element => element.tableId == 400);
    const revenueExpense = valuesObj.filter(element => element.tableId >= 500 && element.tableId < 700);
    console.log("revenueExpense: ", revenueExpense);

    
    console.log("-----Closing Revenue and expense-----");
    const closeRevExp = await insertClosingValues(revenueExpense);
    
    // incomeSummaryValueObj:  [ { tableId: 800, tableName: undefined, debit: 0, credit: 1400 } ]
    // (incomeSummaryTotal > 0) ? incomeSummaryValueObj = [{"tableId": 800, "debit": incomeSummaryTotal, "credit": 0 }] : incomeSummaryValueObj = [{ "tableId": 800, "tableName": undefined, "debit": 0, "credit": incomeSummaryTotal }];
    
    let incomeSummaryValueObj;
    console.log("incomeSummaryTotal: ", closeRevExp.incomeSummaryTotal);
    if (closeRevExp.incomeSummaryTotal > 0) {
      incomeSummaryValueObj = [{ "tableId": 800, "debit": closeRevExp.incomeSummaryTotal, "credit": 0 }]
    }
    else {
      incomeSummaryValueObj = [{ "tableId": 800, "debit": 0, "credit": Math.abs(closeRevExp.incomeSummaryTotal) }];
    }
    // console.log("-----------------------");
    // console.log("incomeSummaryValueObj: ", incomeSummaryValueObj);
    // console.log("-----------------------");
    // let date = new Date().toISOString().slice(0, 10).replace('T', ' ');
    // console.log("incomeSummaryValueObj.tableId: ", incomeSummaryValueObj[0].tableId);
    // let date = "2023-06-11";
    // console.log("date: ", date)
    // const updateQuery = 'UPDATE Heads SET startFrom = ? WHERE tableId = ?';
    // await connection.query(updateQuery, [date, incomeSummaryValueObj[0].tableId], (error, result) => {
    //   if(error) throw(error);
    //   else{
    //     console.log(result);
    //   }
    // });
    console.log("-----Closing Income Summary-----");
    await closeIncomeWithdraw(incomeSummaryValueObj, ownerCapital, "Income-Summary (800)");


    console.log("-----Closing Owner Withdrawl-----");
    await closeIncomeWithdraw(ownerWithdrawl, ownerCapital, "Owner-Withdraw (300)");

    updateStartFromDate(headTablesInfo.tableStartFrom);

    res.status(200).send();
  }
  catch (error) {
    console.error(error);
    res.status(400).send();
    throw new Error('An error occurred during account closing');
  }
};

module.exports = {
  closeAccount: closeAccount,
};



