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
        \`name\` varchar(50) DEFAULT NULL,
        \`startFrom\` date NOT NULL,
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

    // const deleteQuery = `
    //     DROP TABLE IF EXISTS \`Heads\`, \`GeneralJournal\`, \`100\`, \`200\`, \`300\`, \`400\`, \`101\`, \`102\`, \`500\`, \`600\`, \`601\`, \`800\`
    // `;

    const deleteQuery = `
    DROP TABLE IF EXISTS \`Heads\`, \`GeneralJournal\`, \`100\`, \`101\`, \`102\`, \`103\`, \`104\`, \`105\`, \`200\`,\`201\`,\`202\`, \`300\`, \`400\`, \`500\`, \`501\`, \`600\`, \`601\`, \`602\`, \`603\`, \`604\`, \`605\`, \`606\`, \`607\`, \`700\`, \`701\`, \`800\`
    `;

    // Execute the query to create the GeneralJournal table
    connection.query(deleteQuery, (err, result) => {
        // if (err) throw err;
        if (err) console.log(err);
        console.log('Deleted!');
    });
}

function createGeneralJournalTable() {

    // Define the query to create the GeneralJournal table
    // const createTableQuery = `
    //     CREATE TABLE \`GeneralJournal\` (
    //     \`transactionId\` int NOT NULL AUTO_INCREMENT,
    //     \`date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     \`flag\` char(1) DEFAULT NULL,
    //     \`description\` char(50) DEFAULT NULL,
    //     \`creditAccount\` int,
    //     \`debitAccount\` int,
    //     \`amount\` decimal(10,2) DEFAULT NULL,
    //     PRIMARY KEY (\`transactionId\`)
    //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    // `;

    const createTableQuery = `
        CREATE TABLE \`GeneralJournal\` (
        \`transactionId\` int NOT NULL AUTO_INCREMENT,
        \`date\` date NULL DEFAULT NULL,
        \`flag\` char(1) DEFAULT NULL,
        \`description\` char(50) DEFAULT NULL,
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

function getYesterday() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

function addTableToHeadTable(tableCode, tableName) {

    const date = getYesterday();
    console.log(date);
    const sql = `INSERT INTO Heads (tableId, name, startFrom) VALUES ('${tableCode}', '${tableName}', '${date}')`;
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