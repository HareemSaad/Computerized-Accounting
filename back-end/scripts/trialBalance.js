const mysql = require('mysql');
const dotenv = require('dotenv').config()
const fetchTables = require('./fetchTables');


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


const allTablesId = async (AllTablesId) => {
// const allTablesId = async () => {
    // receiving array with all tables Id
    // const AllTablesId = await fetchTables.fetchHeadTablesId();

    //variables
    // var valueMap = new Map();
    const valueObj = [];
    let response = [];
    let allTablesValue = [];

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

                const singleTableResult = await promise;
                allTablesValue.push(singleTableResult);
            });

            await Promise.all(promises);
            resolve(allTablesValue);
        }
        catch (error) {
            reject(error);
        }
    });

    let allTaccValues = await queryPromise;

    allTaccValues.forEach((element, i) => {
        let calcDebCredAmount = calculateDebitCredit(element);

        //insert values(t-account final calculation) in hashmap
        if (calcDebCredAmount > 0) {
            valueObj.push({
                "tableId": AllTablesId[i],
                "debit": calcDebCredAmount,
                "credit": 0
            });
        } else {
            valueObj.push({
                "tableId": AllTablesId[i],
                "debit": 0,
                "credit": Math.abs(calcDebCredAmount)
            });
        }
    });

    return valueObj;
};


module.exports = {
    allTablesId: allTablesId,
};