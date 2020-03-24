const axios = require('axios');
const cheerio = require('cheerio');

let searchWord = '';

let siteTitle = '';

const title = new Set()
const titleTwo = new Set()

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

  //get data from website Posao
  $('.container a[href*="oglasi/"]').each((index, element) => {
    let posao_job = $(element).text()
    let posao_links = $(element).attr('href')
    title.add({posao_job, posao_links})
  })
  
  //get data from website MojPosao
	$('.job-data p').each((index, element) => {
    let mojposao_job = $(element).text()
    let mojposao_links = $(element).find('.job-title a').attr('href')
    titleTwo.add({mojposao_job, mojposao_links})
	})
  
  //get data from website MojPosao in featured selection
  $('#featured-jobs .job-data').each((index, element) => {
    let featured_job = $(element).text()
    let featured_links = $(element).find('a').attr('href')
    titleTwo.add({featured_job, featured_links})
  })

  //console.log(title, titleTwo)

  return {
    searchWord,
    siteTitle,
  	title: [...title],
  	titleTwo: [...titleTwo]
  }
}

module.exports = getResults
