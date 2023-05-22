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


const fetchIdDebCredAmount = async (AllTablesId) => {
    // receiving array with all tables Id
    // const AllTablesId = await fetchTables.fetchHeadTablesId();

    //variables
    let response = [];
    let allTablesValue = [];
    // console.log("AlltablesId: ", AllTablesId);

    // function
    const queryPromise = new Promise(async (resolve, reject) => {
        try {
            const promises = AllTablesId.map(async (item) => {
                const joinTaccGJ = `SELECT \`${item}\`.\`debit\` AS debit, \`${item}\`.\`credit\` AS credit, \`${item}\`.\`amount\` AS amount FROM \`${item}\` JOIN \`GeneralJournal\` ON \`${item}\`.\`transactionId\` = \`GeneralJournal\`.\`transactionId\``;

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

const calculateTrialBalance = async (AllTablesId, AllTablesName) => {
    // console.log("AllTablesId: ", AllTablesId);
    let allTaccValues = await fetchIdDebCredAmount(AllTablesId);
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