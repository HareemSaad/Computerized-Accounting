const mysql = require('mysql');
const dotenv = require('dotenv').config()

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
    // console.log('object');

    const {creditTransactions, debitTransactions, description, txnFlag} = req.body 
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(creditTransactions.length , debitTransactions.length);

    if(creditTransactions.length > debitTransactions.length) {
        // for (let index = 0; index < creditTransactions.length; index++) {
        //     const element = creditTransactions[index];
        //     element.creditTransaction = element.creditTransaction ? 1 : 0;
        //     const insertQuery = `INSERT INTO \`${element.account}\` (date, debit, credit, amount, description, flag) VALUES ('${date}', 0, 1, ${element.creditAmount}, '${element.description}', '${element.flag}')`;
        //     console.log(insertQuery);
        //     //experimental
        //     const debitElement = debitTransactions[0];
        //     const debitInsertQuery = `INSERT INTO \`${debitElement.account}\` (date, debit, credit, amount, description, flag) VALUES ('${date}', 1, 0, ${element.creditAmount}, '${debitElement.description}', '${debitElement.flag}')`;
        //     console.log(debitInsertQuery);
        
        //     // Execute the INSERT statement with the provided data
        //     connection.query(insertQuery, (error, results, fields) => {
            
        //         if (error) throw error;
                
        //         console.log(`Inserted \${results.affectedRows} row(s)`);
        //     });
        
        //     // Execute the INSERT statement with the provided data
        //     connection.query(debitInsertQuery, (error, results, fields) => {
            
        //         if (error) throw error;
                
        //         console.log(`Inserted \${results.affectedRows} row(s)`);
        //     });
        // }
    } else {
        for (let index = 0; index < debitTransactions.length; index++) {
            
            const debitElement = debitTransactions[index];
            const creditElement = creditTransactions[0];
            
            // log to gj
            const insertGjQuery = `INSERT INTO \`GeneralJournal\` (date, flag, description, creditAccount, debitAccount, amount) VALUES ('${date}', '${txnFlag}', '${description}', ${creditElement.account}, ${debitElement.account}, ${debitElement.debitAmount})`;
            connection.query(insertGjQuery, (error, results, fields) => {
                if (error) {
                  return console.error(error.message);
                }
                console.log(results);
            });
            let txnId = await getGjlastId();

            // debit t-acc query
            const debitInsertQuery = `INSERT INTO \`${debitElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 1, 0, ${debitElement.debitAmount})`;
            // console.log(debitInsertQuery);
            // credit t-acc query
            const creditInsertQuery = `INSERT INTO \`${creditElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 0, 1, ${debitElement.debitAmount})`;
            // console.log(creditInsertQuery);
            
            // log to debit t-acc
            connection.query(debitInsertQuery, (error, results, fields) => {
                
                if (error) throw error;
                console.log(`Inserted ${results.affectedRows} row(s)`);
            });
        
            // log to credit t-acc
            connection.query(creditInsertQuery, (error, results, fields) => {
            
                if (error) throw error;
                console.log(`Inserted ${results.affectedRows} row(s)`);
            });
            // creditId = await getlastId(creditElement.account);
            // console.log(debitId, creditId);
            
        }
    }


    
}


module.exports = {
    insertData: insertData
};