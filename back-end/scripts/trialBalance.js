const mysql = require('mysql');
const dotenv = require('dotenv').config()
// const fetchTables = require('./fetchTables');


// establishing connection
const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const calculateDebitCredit = (result) => {
    let amount = 0;
    result.map((resultItem) => {
        if (resultItem.debit === 1) amount += resultItem.amount;
        else if (resultItem.credit === 1) amount -= resultItem.amount;
    })
    return (amount);
}

function convertDateFormat(dateString) {
    dateString = dateString.trim();
    const dateParts = dateString.split(/[/, ]+/);
    const year = dateParts[2];
    const month = dateParts[0] < 10 ? "0" + dateParts[0] : dateParts[0];
    const day = dateParts[1] < 10 ? "0" + dateParts[1] : dateParts[1];
  
    return `${year}-${month}-${day}`;
  }

const fetchIdDebCredAmount = async (AllTablesId, AllTablesStartFromDate) => {
    // receiving array with all tables Id
    // const AllTablesId = await fetchTables.fetchHeadTablesId();
    // console.log("AllTablesStartFromDate: ", AllTablesStartFromDate[0].toISOString().slice(0, 10));
    // console.log("type AllTablesStartFromDate: ", typeof(AllTablesStartFromDate[0]));
    // new Date().toISOString().slice(0, 10).replace('T', ' ');

    //variables
    let response = [];
    let allTablesValue = [];
    // console.log("AlltablesId: ", AllTablesId);

    // function
    const queryPromise = new Promise(async (resolve, reject) => {
        try {
            // const promises = AllTablesId.map(async (item, index) => {
            //     const joinTaccGJ = `SELECT \`${item}\`.\`debit\` AS debit, \`${item}\`.\`credit\` AS credit, \`${item}\`.\`amount\` AS amount 
            //     FROM \`${item}\` 
            //     LEFT JOIN (SELECT * FROM \`GeneralJournal\` WHERE \`date\` > ${AllTablesStartFromDate[index]}) AS \`filtered_journal\` ON \`${item}\`.\`transactionId\` = \`filtered_journal\`.\`transactionId\``;
                
            // const promises = AllTablesId.map(async (item) => {
            //     const joinTaccGJ = `SELECT \`${item}\`.\`debit\` AS debit, \`${item}\`.\`credit\` AS credit, \`${item}\`.\`amount\` AS amount FROM \`${item}\` JOIN (SELECT * FROM \`GeneralJournal\` WHERE \`date\` > '2023-05-23') AS \`filtered_journal\` ON \`${item}\`.\`transactionId\` = \`filtered_journal\`.\`transactionId\``;
            const promises = AllTablesId.map(async (item, index) => {
                // const startDate = AllTablesStartFromDate[index].toISOString().slice(0, 10);
                const startDate = convertDateFormat(AllTablesStartFromDate[index].toLocaleString())
                console.log("from trial balance :: ", startDate);
                const joinTaccGJ = `SELECT \`${item}\`.\`debit\` AS debit, \`${item}\`.\`credit\` AS credit, \`${item}\`.\`amount\` AS amount FROM \`${item}\` JOIN (SELECT * FROM \`GeneralJournal\` WHERE \`date\` > '${startDate}') AS \`filtered_journal\` ON \`${item}\`.\`transactionId\` = \`filtered_journal\`.\`transactionId\``;

                const promise = new Promise((resolve, reject) => {
                    connection.query(joinTaccGJ, (error, result) => {
                        if (error) reject(error);
                        else {
                            response = result;
                        }
                        resolve(response);
                    });
                });

                // allTablesValue.push(singleTableResult);
                const singleTableResult = await promise;
                allTablesValue.push({
                    "tableId": item,
                    "singleTableValues": singleTableResult,
                });
            });
            
            await Promise.all(promises);
            resolve(allTablesValue);
        }
        catch (error) {
            reject(error);
        }
    });
    
    return (queryPromise);
    
};

const calculateTrialBalance = async (AllTablesId, AllTablesName, AllTablesStartFromDate) => {
    //bring head table convert to json
    //
    // console.log("AllTablesId: ", AllTablesId);
    let allTaccValues = await fetchIdDebCredAmount(AllTablesId, AllTablesStartFromDate);
    // console.log("allTaccValues: ", allTaccValues);
    const valueObj = [];
    let calcDebCredAmount;
    
    allTaccValues.forEach((element, i) => {
        calcDebCredAmount = calculateDebitCredit(element.singleTableValues);
        // console.log("element: ", element);
        // calcDebCredAmount = calculateDebitCredit(element);
        
        //insert values(t-account final calculation) in object
        if (calcDebCredAmount > 0) {
            valueObj.push({
                // "tableId": AllTablesId[i],
                "tableId": element.tableId,
                "tableName": AllTablesName[i],
                "debit": calcDebCredAmount,
                "credit": 0
            });
        } 
        else {
            valueObj.push({
                // "tableId": AllTablesId[i],
                "tableId": element.tableId,
                "tableName": AllTablesName[i],
                "debit": 0,
                "credit": Math.abs(calcDebCredAmount)
            });
        }
    });
    // console.log("valueObj: ", valueObj);
    return valueObj;
}


module.exports = {
    calculateTrialBalance: calculateTrialBalance,
    fetchIdDebCredAmount: fetchIdDebCredAmount,
    calculateDebitCredit: calculateDebitCredit
};