const express = require('express');
const router = express.Router();
//const functions = require("../index")
const getResults = require("../index");
//const searchJob = require("../index")

// home page. 
router.get('/', async function(req, res, next) {
  const result = await getResults()
  //const searchTerm = req.query.keyword
 // console.log(searchTerm)
  res.render('index', result);
});

/* search page
router.get('/search', function(req, res) {
  res.render('search');
  //res.end('done')
});
*/
module.exports = router;
