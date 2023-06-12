const mysql = require('mysql');
const dotenv = require('dotenv').config()
const trialBalance = require('./../scripts/trialBalance.js');
const fetchTables = require('./fetchTables.js');

const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function insertDatatest(tableCode, debit, credit, amount, description, flag) {
  let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Assign 0 or 1 to the debit and credit variables based on the boolean value
  const debitValue = debit ? 1 : 0;
  const creditValue = credit ? 1 : 0;

  // Define the INSERT statement with the correct values
  const insertQuery = `INSERT INTO \`${tableCode}\` (date, debit, credit, amount, description, flag) VALUES ('${date}', ${debitValue}, ${creditValue}, ${amount}, '${description}', '${flag}')`;
  console.log(insertQuery);

  // Execute the INSERT statement with the provided data
  connection.query(insertQuery, (error, results, fields) => {

    if (error) throw error;

    console.log(`Inserted \${results.affectedRows} row(s)`);
  });
}

const getlastId = async (table_name) => {

  // Define the query to fetch all tables
  let sql = `SELECT * FROM \`${table_name}\` ORDER BY transactionId DESC LIMIT 1`;
  let response;
  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results;
        resolve(response);
        //   console.log(response);
      }
    });
  });

  // Wait for the query to complete and send the response

  await queryPromise;
  console.log("here: ", response[0].transactionId);
  return response[0].transactionId;
}

const getGjlastId = async () => {

  // Define the query to fetch all tables
  let sql = `SELECT * FROM \`GeneralJournal\` ORDER BY transactionId DESC LIMIT 1`;
  let response;
  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results;
        resolve(response);
        //   console.log(response);
      }
    });
  });

  // Wait for the query to complete and send the response

  await queryPromise;
  // console.log("here: ", response[0].transactionId);
  return response[0].transactionId;
}

const insertData = async (req, res) => {

  /**
   * tableIds - array of all the tables involved
   * accountWeight - json object from app.js signifies which account type is written in debit and which in credit
   */
  // console.log("------------------------");
  // console.log("req.body: ", req.body);
  // console.log("------------------------");
  const { creditTransactions, debitTransactions, description, txnFlag, accountWeight, tableIds } = req.body
  // let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // let date = new Date().toISOString().slice(0, 10).replace('T', ' ');
  let date = "2023-06-15";

  console.log("tableIds: ", tableIds);
  try {
    // get trial balance for each table to get there cummulative debit / credit
    let data;
    const info = await fetchTables.specificHeadTableStartFrom(tableIds);
    console.log("-------------------------------------");
    console.log("info: ",info)
    console.log("-------------------------------------");
    const getTrialBalance = async () => {
      // data = await trialBalance.calculateTrialBalance(tableIds, "", "");
      data = await trialBalance.calculateTrialBalance(tableIds, "", info.tableStartFrom);
    }
    // when you get the trial balance then
    getTrialBalance().then(async () => {
      console.log('data', data);
      // check if credit transactions > debit txns
      if (creditTransactions.length > debitTransactions.length) {
        try {
          // if yes, iterate through the credit transactions - debit remains constant
          // d <-> c1 | d <-> c2 ....
          for (let index = 0; index < creditTransactions.length; index++) {
            const debitElement = debitTransactions[0];
            const creditElement = creditTransactions[index];

            // get their head type i.e a table with code 523 belongs to the "revenue": 500 account
            // 523 -> 5 * 100 -> 500
            const debitHeadType = Number(String(debitElement.account)[0]) * 100;
            const creditHeadType = Number(String(creditElement.account)[0]) * 100;

            // merchandising / invertory management
            // check if t-account will be balanced after the new entry
            console.log('data', data);
            // console.log('date', date);
            let goAhead = ifOverflow(
              debitHeadType,
              creditHeadType,
              creditElement.account,
              debitElement.account,
              creditElement.creditAmount,
              accountWeight,
              data
            );

            // if yes insert to GJ
            if (goAhead) {
              // log to gj
              const status = await insertToGJWithTwoCreditTransactions(
                date,
                txnFlag,
                description,
                creditElement.account,
                debitElement.account,
                creditElement.creditAmount
              )
              if (!status) {
                console.log("from backend - GJWithTwoCredit :: ", status);
                res.status(400).send(); // if fail
              }
              res.status(200).send(); // if success
            } else {
              // else fail
              res.status(401).send();
            }
          }
        } catch (error) {
          console.log(error);
          res.status(400).send();
        }
      } else {
        try {
          // if no, iterate through the debit transactions - credit remains constant
          // c <-> d1 | c <-> d2 ....
          // console.log(data)
          console.log("debitTransactions: ", debitTransactions);
          for (let index = 0; index < debitTransactions.length; index++) {
            console.log("check");
            const debitElement = debitTransactions[index];
            const creditElement = creditTransactions[0];

            // get their head type i.e a table with code 523 belongs to the "revenue": 500 account
            // 523 -> 5 * 100 -> 500 
            const debitHeadType = Number(String(debitElement.account)[0]) * 100;
            const creditHeadType = Number(String(creditElement.account)[0]) * 100;

            // merchandising / invertory management
            // check if t-account will be balanced after the new entry
            console.log('data 1: ', data);
            let goAhead = ifOverflow(
              debitHeadType,
              creditHeadType,
              creditElement.account,
              debitElement.account,
              debitElement.debitAmount,
              accountWeight,
              data
            );

            // if yes insert to GJ
            // console.log("datee: ", date);
            if (goAhead) {
              // log to gj
              const status = await insertToGJWithTwoDebitTransactions(
                date,
                txnFlag,
                description,
                creditElement.account,
                debitElement.account,
                debitElement.debitAmount
              )
              if (!status) {
                console.log("from backend - GJWithTwoDebit :: ", status);
                res.status(400).send(); // if fail
              }
              res.status(200).send(); // if success
            } else {
              res.status(401).send(); // if fail
            }

          }
        } catch (error) {
          console.log(error);
          res.status(400).send();
        }
      }
    });
  } catch (error) {
    res.status(400).send(error)
  }
}


/**
 * 
 * @param {*} date 
 * @param {*} txnFlag 
 * @param {*} description 
 * @param {*} creditElementAccount credit account (table) name (code)
 * @param {*} debitElementAccount debit account (table) name (code)
 * @param {*} amount 
 * @returns txn success true or false
 * 
 * inserts to GJ if succes inserts to T-Account
 */
const insertToGJWithTwoCreditTransactions = async (date, txnFlag, description, creditElementAccount, debitElementAccount, amount) => {
  const insertGjQuery = `INSERT INTO \`GeneralJournal\` (date, flag, description, creditAccount, debitAccount, amount) VALUES ('${date}', '${txnFlag}', '${description}', ${creditElementAccount}, ${debitElementAccount}, ${amount})`;
  connection.query(insertGjQuery, async (error, gjResults, fields) => {
    if (error) {
      console.error(error.message);
      return false
    } else {
      console.log(gjResults);
      let txnId = await getGjlastId();

      // debit t-acc query
      const debitInsertQuery = `INSERT INTO \`${debitElementAccount}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 1, 0, ${amount})`;

      // credit t-acc query
      const creditInsertQuery = `INSERT INTO \`${creditElementAccount}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 0, 1, ${amount})`;

      // log to debit and credit t-acc only if insert into gj is successful
      connection.query(debitInsertQuery, (error, debitResults, fields) => {
        if (error) {
          console.error(error.message);
          return false
        } else {
          console.log(`Inserted ${debitResults.affectedRows} row(s)`);
          connection.query(creditInsertQuery, (error, creditResults, fields) => {
            if (error) {
              console.error(error.message);
              return false
            } else {
              console.log(`Inserted ${creditResults.affectedRows} row(s)`);
              return true
            }
          });
        }
      });
    }
  });
  return true
}

/**
 * 
 * @param {*} date 
 * @param {*} txnFlag 
 * @param {*} description 
 * @param {*} creditElementAccount credit account (table) name (code)
 * @param {*} debitElementAccount debit account (table) name (code)
 * @param {*} amount 
 * @returns txn success true or false
 * 
 * inserts to GJ if succes inserts to T-Account
 */
const insertToGJWithTwoDebitTransactions = async (date, txnFlag, description, creditElementAccount, debitElementAccount, amount) => {
  const insertGjQuery = `INSERT INTO \`GeneralJournal\` (date, flag, description, creditAccount, debitAccount, amount) VALUES ('${date}', '${txnFlag}', '${description}', ${creditElementAccount}, ${debitElementAccount}, ${amount})`;
  connection.query(insertGjQuery, async (error, gjResults, fields) => {
    if (error) {
      console.error(error.message);
      return false
    } else {
      console.log(gjResults);
      let txnId = await getGjlastId();

      // debit t-acc query
      const debitInsertQuery = `INSERT INTO \`${debitElementAccount}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 1, 0, ${amount})`;

      // credit t-acc query
      const creditInsertQuery = `INSERT INTO \`${creditElementAccount}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 0, 1, ${amount})`;

      // log to debit and credit t-acc only if insert into gj is successful
      connection.query(debitInsertQuery, (error, debitResults, fields) => {
        if (error) {
          console.error(error.message);
          return false
        } else {
          console.log(`Inserted ${debitResults.affectedRows} row(s)`);
          connection.query(creditInsertQuery, (error, creditResults, fields) => {
            if (error) {
              console.error(error.message);
              return false
            } else {
              console.log(`Inserted ${creditResults.affectedRows} row(s)`);
              return true
            }
          });
        }
      });
    }
  });
  return true
}

/**
 * 
 * @param {*} tableId 
 * @param {*} data json from trial balance 
 * @returns json with a table's cummulative debit / credit
 */
function getDebitAndCredit(tableId, data) {
  // console.log("from getDebitAndCredit data :: ", data);
  const result = data.find(item => item.tableId === tableId);
  if (result) {
    return { debit: result.debit, credit: result.credit };
  } else {
    return null;
  }
}

/**
 * 
 * @param {*} debitHeadType account type of table in debit transaction
 * @param {*} creditHeadType account type of table in credit transaction
 * @param {*} creditElementAccount table in credit transaction
 * @param {*} debitElementAccount table in debit transaction
 * @param {*} amount 
 * @param {*} accountWeight json of account weight from App.js (from req.body)
 * @param {*} data json from trial balance
 * @returns true if overflows false if it doen't
 */
function ifOverflow(debitHeadType, creditHeadType, creditElementAccount, debitElementAccount, amount, accountWeight, data) {
  // console.log("from overflow data :: ", data);
  // if an account in debit txn has net sum of t-acc in debit no check necessary
  // as we are adding the value
  // if an account in debit txn has net sum of t-acc in credit check necessary
  // as we are subtracting credit from cummulative debit (not enough balance issues
  // cash with debit of 5000 cannot credit 5001
  if (accountWeight[debitHeadType] === 'credit') {
    const obj = getDebitAndCredit(debitElementAccount, data)
    if (parseFloat(amount) > parseFloat(obj.credit)) {
      return false
    }
  }
  if (accountWeight[creditHeadType] === 'debit') {
    const obj = getDebitAndCredit(creditElementAccount, data)
    if (parseFloat(amount) > parseFloat(obj.debit)) {
      return false
    }
  }
  return true;
}

module.exports = {
  insertData: insertData
};