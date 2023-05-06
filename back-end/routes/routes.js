const express = require('express');
const {fetchTables} = require('./../scripts/fetchTables');
const {insertData} = require('./../scripts/insertData');

const router = express.Router();

router.post("/fetchTables", fetchTables);
router.post("/insertTxns", insertData);

module.exports = {
    routes: router
  }
  