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
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to the MySQL server!');
    });

    // Define the query to create the T-Accounts table
    const createTableQuery = `
    CREATE TABLE \`Heads\` (
        \`tableId\` int NOT NULL,
        \`name\` varchar(25) DEFAULT NULL,
        PRIMARY KEY (\`tableId\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the Heads table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Heads table created successfully!');

        // End the database connection
        connection.end((err) => {
            if (err) throw err;
            console.log('Database connection closed!');
        });
    })
}

function dropAllTables() {

    // Connect to the database
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to the MySQL server!');
    });

    const selectTablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = '${process.env.DB_USERNAME}';
    `;

    // Execute the query to select table names
    connection.query(selectTablesQuery, (err, results) => {
        if (err) throw err;

        // Build an array of DROP TABLE queries for each table
        const dropTableQueries = results.map((result) => {
        return `DROP TABLE IF EXISTS \`${result.table_name}\`;`;
        });

        // Join the DROP TABLE queries into a single string
        const dropAllTablesQuery = dropTableQueries.join('\n');

        // Execute the query to drop all tables
        connection.query(dropAllTablesQuery, (err, result) => {
        if (err) throw err;
        console.log('All tables dropped successfully!');
        })

        // End the database connection
        connection.end((err) => {
        if (err) throw err;
        console.log('Database connection closed!');
        });
    })
}

function createGeneralJournalTable() {

    // Connect to the database
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to the MySQL server!');
    });

    // Define the query to create the GeneralJournal table
    const createTableQuery = `
        CREATE TABLE \`GeneralJournal\` (
        \`transactionId\` int NOT NULL AUTO_INCREMENT,
        \`creditAccount\` int,
        \`debitAccount\` int,
        \`debitTransaction\` int,
        \`creditTransaction\` int,
        PRIMARY KEY (\`transactionId\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the GeneralJournal table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('GeneralJournal table created successfully!');

        // End the database connection
        connection.end((err) => {
        if (err) throw err;
        console.log('Database connection closed!');
        });
    });
}
  
function createTAcountTable(tableCode, tableName) {

    // Connect to the database
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to the MySQL server!');
    });

        // Define the query to create the T-Accounts table
    const createTableQuery = `
        CREATE TABLE \`${tableCode}\` (
        \`transactionId\` int NOT NULL,
        \`date\` date DEFAULT NULL,
        \`debit\` tinyint(1) DEFAULT NULL,
        \`credit\` tinyint(1) DEFAULT NULL,
        \`amount\` decimal(10,2) DEFAULT NULL,
        \`flag\` char(1) DEFAULT NULL,
        PRIMARY KEY (\`transactionId\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    // Execute the query to create the T-Accounts table
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('T-Accounts table created successfully!');

        addFkToGj(tableCode);
        addTableToHeadTable(tableCode, tableName)

        // End the database connection
        connection.end((err) => {
        if (err) throw err;
        console.log('Database connection closed!');
        });
    })
}

function addFkToGj(tableCode) {
    // const sql = `ALTER TABLE GeneralJournal ADD CONSTRAINT fk_debit_transaction FOREIGN KEY (debitTransaction) REFERENCES ${tableCode}(transactionId)`;
    const sql = `ALTER TABLE GeneralJournal ADD CONSTRAINT fk_debit_transaction${tableCode} FOREIGN KEY (debitTransaction) REFERENCES \`${tableCode}\`(transactionId)`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Foreign key added!");
    });

    const sql1 = `ALTER TABLE GeneralJournal ADD CONSTRAINT fk_credit_transaction${tableCode} FOREIGN KEY (creditTransaction) REFERENCES \`${tableCode}\`(transactionId)`;
    connection.query(sql1, (err, result) => {
        if (err) throw err;
        console.log("Foreign key added!");
    });
}

function addTableToHeadTable(tableCode, tableName) {
    const sql = `INSERT INTO Heads (tableId, name) VALUES ('${tableCode}', '${tableName}')`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("1 row inserted");
    });
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