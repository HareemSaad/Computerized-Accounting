const express = require('express');
const {fetchTables} = require('./../scripts/fetchTables');

const router = express.Router();

router.post("/fetchTables", fetchTables);

module.exports = {
    routes: router
  }
  