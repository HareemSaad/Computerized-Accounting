const mysql = require('mysql');
const dotenv = require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const fetchAllTables = async (req, res) => {
  let response = [];

  // Connect to the database
  // connection.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to the MySQL server!');
  // });

  // Define the query to fetch all tables
  const showTableQuery = `SHOW TABLES`;

  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(showTableQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results.map(result => Object.values(result)[0]);
        // response = results.map(result => Object.values(result)[0]).slice(0, -2); // to get only t accounts
        resolve(response);
      }
    });
  });

  // Wait for the query to complete and send the response
  try {
    const tables = await queryPromise;
    console.log(tables);
    // connection.end();
    res.status(200).send(tables);
  } catch (error) {
    console.error(error.message);
    // connection.end();
    res.status(500).send('Error fetching tables');
  }
};

const fetchTables = async (req, res) => {
  let response = [];

  // Connect to the database
  // connection.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to the MySQL server!');
  // });

  // Define the query to fetch all tables
  const showTableQuery = `SELECT * FROM Heads`;

  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(showTableQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results;
        resolve(response);
        // console.log(response);
      }
    });
  });

  // Wait for the query to complete and send the response
  try {
    const tables = await queryPromise;
    console.log('tables :: ', tables);
    // connection.end();
    res.status(200).send(tables);
  } catch (error) {
    console.error(error.message);
    // connection.end();
    res.status(500).send('Error fetching tables');
  }
};

const fetchHeadTablesId = async (req, res) => {
  let response = [];

  // Connect to the database
  // connection.connect((err) => {
  //   if (err) throw err;
  //   console.log('Connected to the MySQL server!');
  // });

  // Define the query to fetch all tables
  const showTableQuery = `SELECT tableId FROM Heads`;

  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(showTableQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results;
        resolve(response);
        // console.log(response);
      }
    });
  });

  // Wait for the query to complete and send the response
  try {
    const AllTablesId = [];
    const tables = await queryPromise;
    // console.log('tables :: ', tables);
    tables.forEach(item => {
      AllTablesId.push(item.tableId);
    })

    
    return AllTablesId;

    // connection.end();
    // res.status(200).send(tables);
  } catch (error) {
    console.error(error.message);
    // connection.end();
    // res.status(500).send('Error fetching tables');
  }
};

const specificHeadTablesId = async (start, end, req, res) => {
  let response = [];

  // Define the query to fetch all tables
  // const showTableQuery = `SELECT tableId FROM Heads WHERE tableId >= ${start} AND tableId < ${end} OR tableId = 800`;
  const showTableQuery = `SELECT tableId FROM Heads WHERE tableId >= ${start} AND tableId < ${end}`;

  // Execute the query and return a Promise
  const queryPromise = new Promise((resolve, reject) => {
    connection.query(showTableQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        response = results;
        resolve(response);
      }
    });
  });

  // Wait for the query to complete and send the response
  try {
    const tablesId = [];
    const tables = await queryPromise;
    tables.forEach(item => {
      tablesId.push(item.tableId);
    })
    
    return (tablesId);
  } catch (error) {
    console.error(error.message);
  }
};


module.exports = {
  fetchTables: fetchTables,
  fetchHeadTablesId: fetchHeadTablesId,
  specificHeadTablesId: specificHeadTablesId
};