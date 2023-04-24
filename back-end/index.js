const express = require("express") //import express
const bodyParser = require("body-parser") //import body parser
const path = require('path')
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv').config()
const mysql = require('mysql');
let poolRoutes = require('./routes/routes');
const tableCreation = require('./scripts/tableCreation.js');
const port = 3000;

const app = express();
app.use(express.json())

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
  database: process.env.DB_USERNAME
});

main().catch(err => console.log(err));

async function main() {
  // DON'T UNCOMMENT THESE
  // tableCreation.createTAcountTable(301, "Owner Equity")
  // tableCreation.createTAcountTable(401, "Owner Withdrawal")
  // tableCreation.createHeadsTable()
  // tableCreation.createGeneralJournalTable()
  // tableCreation.dropAllTables()
}

app.use("/", poolRoutes.routes);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));