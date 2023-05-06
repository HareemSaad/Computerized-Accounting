const mysql = require('mysql');
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Delete all records from the table
function deleteAllRecords(table_name) {
    
      
      // Define the DELETE statement
      const deleteQuery = `DELETE FROM ${table_name}`;
      
      // Execute the DELETE statement
      connection.query(deleteQuery, function(error, results, fields) {
        
        if (error) throw error;
        
        console.log(`Deleted \${results.affectedRows} row(s)`);
      });
  }

  module.exports = {
    deleteAllRecords: deleteAllRecords
};