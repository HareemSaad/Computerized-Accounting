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

function insertData() {
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


module.exports = {
    insertData: insertData
};