const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser") //import body parser
const path = require('path')
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv').config()
const mysql = require('mysql');
let poolRoutes = require('./routes/routes');
const tableCreation = require('./scripts/tableCreation.js');
const fetching = require('./scripts/fetchTables.js');
const insertData = require('./scripts/insertData.js');
const port = 3000;

const app = express();
app.use(express.json())
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3001' }));


/**
 * to render css
 * this tell where these files are located
 * then index files have rest of the links
 */
// app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

main().catch(err => console.log(err));

async function main() {
  // Connect to the database
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server!');
  });
  
  // DON'T UNCOMMENT THESE
  // tableCreation.createHeadsTable()
  // tableCreation.createGeneralJournalTable()
  // tableCreation.createTAcountTable(300, "Owner Capital")
  // tableCreation.createTAcountTable(400, "Owner Withdrawal")
  // tableCreation.createTAcountTable(100, "Cash")
  // tableCreation.dropAllTables()
  // fetching.fetchTables()
  // insertData.insertData(100, true, false, 100, 'test', 'N');

}

app.use("/", poolRoutes.routes);

app.get('/', (req, res) => res.send('Hello World!'));
// app.get('/fetchTables', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));