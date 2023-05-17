const mysql = require('mysql');
const dotenv = require('dotenv').config()
const {createTAcountTable} = require ("./tableCreation")

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Delete all records from the table
const createAccount = async (req, res) => {

    const {accountType, accountName, accountTypesReference} = req.body
    console.log(req.body);
    let tableCode = parseInt(accountTypesReference[accountType]);
    console.log(tableCode);

    const getLastAccountInType = `SELECT * FROM \`Heads\` WHERE tableId < ${tableCode + 100} ORDER BY tableId DESC LIMIT 1;` 
    connection.query(getLastAccountInType, (error, getLastAccountInType, fields) => {
        if (error) {
          console.error(error.message);
          res.status(400).send();
        }
        else {
            // console.error(getLastAccountInType);
            tableCode = parseInt(getLastAccountInType[0].tableId) + 1
            console.log(tableCode);
            try {
                createTAcountTable(tableCode, accountName)
                res.status(200).send();
            } catch (error) {
                console.log(error);
                res.status(400).send();
            }
        }
    })
  }

  module.exports = {
    createAccount: createAccount
};