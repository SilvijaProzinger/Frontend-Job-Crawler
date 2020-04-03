const axios = require('axios');
const cheerio = require('cheerio');

let searchWord = '';

let siteTitle = '';

let title = []
let titleTwo = []

const fetchData = async (searchWord) => {

  const pageOne = `http://www.posao.hr/poslovi/izraz/${searchWord}`;
  const pageTwo = `http://www.moj-posao.net/Pretraga-Poslova/?searchWord=${searchWord}&keyword=${searchWord}`;

  reqOne = () => axios.get(pageOne)
  reqTwo = () => axios.get(pageTwo)

  const [resultOne, resultTwo] = await axios.all([reqOne(), reqTwo()])
  const bodyOne = resultOne.data
  const bodyTwo = resultTwo.data

  const body = bodyOne + bodyTwo

  return cheerio.load(body)
}

const getResults = async (searchWord) => {

  $ = await fetchData(searchWord)

	siteTitle = `Job results for ${searchWord}`
  let titleUnfiltered = []

  //get data from website Posao
  $('.container a[href*="oglasi/"]').each(function () {
    titleUnfiltered.push({
      title: $(this).find('.title').text(),
      location: $(this).find('.location').text(),
      deadline: $(this).find('.deadline').text(),
      company: $(this).find('.company').text(),
      link: $(this).attr('href')
    });
  })
  
  //filter empty values from titleUnfiltered
  title = titleUnfiltered.filter(function(o){
    let values = Object.values(o)
    let arr2 = ["", null]
    if(arr2.some(function (val){ return values.indexOf(val) >=0}))
      return false
    else 
      return true
  })

  //get data from website MojPosao
	$('.job .general-info').each(function () {
    titleTwo.push({
      title: $(this).find('.job-title').text(),
      location: $(this).find('job-location').text(),
      deadline: $(this).find('.deadline').text(),
      company: $(this).find('.job-company').text(),
      link: $(this).find('.job-title a').attr('href')
    })
	})

  return {
    searchWord,
    siteTitle,
  	title: [...title],
  	titleTwo: [...titleTwo]
  }


}

module.exports = getResults
