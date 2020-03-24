const express = require('express');
const router = express.Router();
const getResults = require("../index");

// home page. 
router.get('/', async function(req, res, next) {
  const searchWord = 'frontend' //by default we'll search for frontend jobs
  const result = await getResults(searchWord)
  res.render('index', result);
});

// search page
router.get('/search', async function(req, res, next) {
  const searchWord = req.query.keyword //the search word now changes based on what the user typed in
  console.log(searchWord)
  const result = await getResults(searchWord)
  res.render('index', result);
});

module.exports = router;
