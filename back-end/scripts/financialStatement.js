// const mysql = require('mysql');
// const dotenv = require('dotenv').config()
const fetchTables = require('./fetchTables');
const trialBalance = require('./trialBalance');

// establishing connection
// const connection = mysql.createConnection({
//     host: process.env.DB_SERVER,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

const fetchIdTotalAmount = async () => {
    // receiving array with all tables Id
    const AllTablesId = await fetchTables.fetchHeadTablesId();
    let allTaccValues = await trialBalance.fetchIdDebCredAmount(AllTablesId);
    let valuesObj = [], calcAmount = 0;

    allTaccValues.forEach((element, index) => {
        calcAmount = trialBalance.calculateDebitCredit(element.singleTableValues);

        valuesObj.push({
            "tableId": element.tableId,
            "amount": Math.abs(calcAmount)
        })
    });
    return(valuesObj);
}


module.exports = {
    fetchIdTotalAmount: fetchIdTotalAmount,
};