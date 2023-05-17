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

    const {creditTransactions, debitTransactions, description, txnFlag, accountWeight} = req.body 
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // get heads table instance
    for (let index = 0; index < creditTransactions.length; index++) {
      const getLastClosingDate = `SELECT * FROM \`Heads\` WHERE tableId = ${creditTransactions[index].account};`
      connection.query(getLastClosingDate, (error, getLastClosingDate, fields) => {
        if (error) {
          console.error(error.message);
          res.status(400).send();
        }
        else {
            // console.error(getLastClosingDate);
            closingDate = getLastClosingDate[0].startFrom;
            console.log(closingDate);
            closingDate = `${closingDate.getFullYear()}-${closingDate.getMonth() + 1}-${closingDate.getDate()}`
            console.log(closingDate);
            try {
              const getBalanceQuery = `SELECT * FROM \`GeneralJournal\` WHERE DATE(date) >= ${closingDate} AND creditAccount = ${creditTransactions[index].account};`;
              console.log(getBalanceQuery);
                    connection.query(getBalanceQuery, async (error, getBalanceQueryResult, fields) => {
                      if (error) {
                        console.error(error.message);
                        res.status(400).send();
                      } else {
                        console.log(getBalanceQueryResult);
                        res.status(200).send();
                      }
                    });
            } catch (error) {
                console.log(error);
                res.status(400).send();
            }
        }
      })
    }
    // console.log(accountWeight);


    console.log(creditTransactions.length , debitTransactions.length);

    // if(creditTransactions.length > debitTransactions.length) {
    //   try {
    //     for (let index = 0; index < creditTransactions.length; index++) {
    //       const debitElement = debitTransactions[0];
    //       const creditElement = creditTransactions[index];
    
    //       // log to gj
    //       const insertGjQuery = `INSERT INTO \`GeneralJournal\` (date, flag, description, creditAccount, debitAccount, amount) VALUES ('${date}', '${txnFlag}', '${description}', ${creditElement.account}, ${debitElement.account}, ${creditElement.creditAmount})`;
    //       connection.query(insertGjQuery, async (error, gjResults, fields) => {
    //         if (error) {
    //           console.error(error.message);
    //           res.status(400).send();
    //         } else {
    //           console.log(gjResults);
    //           let txnId = await getGjlastId();
    
    //           // debit t-acc query
    //           const debitInsertQuery = `INSERT INTO \`${debitElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 1, 0, ${creditElement.creditAmount})`;
    
    //           // credit t-acc query
    //           const creditInsertQuery = `INSERT INTO \`${creditElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 0, 1, ${creditElement.creditAmount})`;
    
    //           // log to debit and credit t-acc only if insert into gj is successful
    //           connection.query(debitInsertQuery, (error, debitResults, fields) => {
    //             if (error) {
    //               console.error(error.message);
    //               res.status(400).send();
    //             } else {
    //               console.log(`Inserted ${debitResults.affectedRows} row(s)`);
    //               connection.query(creditInsertQuery, (error, creditResults, fields) => {
    //                 if (error) {
    //                   console.error(error.message);
    //                   res.status(400).send();
    //                 } else {
    //                   console.log(`Inserted ${creditResults.affectedRows} row(s)`);
    //                   res.status(200).send();
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).send();
    //   }
    // } else {
    //   try {
    //     for (let index = 0; index < debitTransactions.length; index++) {
    //       const debitElement = debitTransactions[index];
    //       const creditElement = creditTransactions[0];
    
    //       // log to gj
    //       const insertGjQuery = `INSERT INTO \`GeneralJournal\` (date, flag, description, creditAccount, debitAccount, amount) VALUES ('${date}', '${txnFlag}', '${description}', ${creditElement.account}, ${debitElement.account}, ${debitElement.debitAmount})`;
    //       connection.query(insertGjQuery, async (error, gjResults, fields) => {
    //         if (error) {
    //           console.error(error.message);
    //           res.status(400).send();
    //         } else {
    //           console.log(gjResults);
    //           let txnId = await getGjlastId();
    
    //           // debit t-acc query
    //           const debitInsertQuery = `INSERT INTO \`${debitElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 1, 0, ${debitElement.debitAmount})`;
    
    //           // credit t-acc query
    //           const creditInsertQuery = `INSERT INTO \`${creditElement.account}\` (transactionId, debit, credit, amount) VALUES ('${txnId}', 0, 1, ${debitElement.debitAmount})`;
    
    //           // log to debit and credit t-acc only if insert into gj is successful
    //           connection.query(debitInsertQuery, (error, debitResults, fields) => {
    //             if (error) {
    //               console.error(error.message);
    //               res.status(400).send();
    //             } else {
    //               console.log(`Inserted ${debitResults.affectedRows} row(s)`);
    //               connection.query(creditInsertQuery, (error, creditResults, fields) => {
    //                 if (error) {
    //                   console.error(error.message);
    //                   res.status(400).send();
    //                 } else {
    //                   console.log(`Inserted ${creditResults.affectedRows} row(s)`);
    //                   res.status(200).send();
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).send();
    //   }
    // }


    
}


module.exports = {
    insertData: insertData
};