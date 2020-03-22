const express = require('express');
const router = express.Router();
//const functions = require("../index")
const getResults = require("../index");
//const searchJob = require("../index")

/* GET home page. */
router.get('/', async function(req, res, next) {
  //const search = searchJob()
  const result = await getResults()
  res.render('index', result);
  //res.end('done')
});

module.exports = router;
