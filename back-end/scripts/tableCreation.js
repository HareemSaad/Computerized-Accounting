const mysql = require('mysql');
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function createHeadsTable() {

    // Connect to the database
    // connection.connect((err) => {
    //     if (err) throw err;
    //     console.log('Connected to the MySQL server!');
    // });

    // Define the query to create the T-Accounts table
    const createTableQuery = `
    CREATE TABLE \`Heads\` (
        \`tableId\` int NOT NULL,
        \`name\` varchar(25) DEFAULT NULL,
        \`startFrom\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`tableId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the Heads table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Heads table created successfully!');

        // End the database connection
        // connection.end((err) => {
        //     if (err) throw err;
        //     console.log('Database connection closed!');
        // });
    })
}

function dropAllTables() {

    // Connect to the database
    // connection.connect((err) => {
    //     if (err) throw err;
    //     console.log('Connected to the MySQL server!');
    // });

    const deleteQuery = `
        DROP TABLE IF EXISTS \`Heads\`, \`GeneralJournal\`, \`100\`, \`200\`, \`300\`, \`400\`, \`101\`, \`102\`, \`500\`, \`600\`, \`601\`
    `;

    // Execute the query to create the GeneralJournal table
    connection.query(deleteQuery, (err, result) => {
        if (err) throw err;
        console.log('Deleted!');
    });
}

function createGeneralJournalTable() {

    // Define the query to create the GeneralJournal table
    const createTableQuery = `
        CREATE TABLE \`GeneralJournal\` (
        \`transactionId\` int NOT NULL AUTO_INCREMENT,
        \`date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`flag\` char(1) DEFAULT NULL,
        \`description\` char(25) DEFAULT NULL,
        \`creditAccount\` int,
        \`debitAccount\` int,
        \`amount\` decimal(10,2) DEFAULT NULL,
        PRIMARY KEY (\`transactionId\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the GeneralJournal table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('GeneralJournal table created successfully!');
    });
}
  
function createTAcountTable(tableCode, tableName) {

    // Define the query to create the T-Accounts table
    const createTableQuery = `
        CREATE TABLE \`${tableCode}\` (
        \`transactionId\` int NOT NULL,
        \`debit\` tinyint(1) DEFAULT NULL,
        \`credit\` tinyint(1) DEFAULT NULL,
        \`amount\` decimal(10,2) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the T-Accounts table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('T-Accounts table created successfully!');

        addFkToGj(tableCode);
        addTableToHeadTable(tableCode, tableName)

    })
}

function addFkToGj(tableCode) {
    // const sql = `ALTER TABLE GeneralJournal ADD CONSTRAINT fk_debit_transaction FOREIGN KEY (debitTransaction) REFERENCES ${tableCode}(transactionId)`;
    const sql = `ALTER TABLE \`${tableCode}\` ADD CONSTRAINT fk_transaction${tableCode} FOREIGN KEY (transactionId) REFERENCES GeneralJournal (transactionId)`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Foreign key added!");
    });
}

function addTableToHeadTable(tableCode, tableName) {
    const sql = `INSERT INTO Heads (tableId, name) VALUES ('${tableCode}', '${tableName}')`;
    const output = connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("1 row inserted");
    });
    // console.log(output);
}
  
module.exports = {
    createTAcountTable: createTAcountTable,
    createHeadsTable: createHeadsTable,
    dropAllTables: dropAllTables,
    createGeneralJournalTable: createGeneralJournalTable
};

/**
 * ,
        CONSTRAINT fk_debit_transaction FOREIGN KEY (\`debitTransaction\`) REFERENCES \`T-Accounts\`(\`transactionId\`),
        CONSTRAINT fk_credit_transaction FOREIGN KEY (\`creditTransaction\`) REFERENCES \`T-Accounts\`(\`transactionId\`)
 */