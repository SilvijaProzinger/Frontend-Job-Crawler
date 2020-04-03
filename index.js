const axios = require('axios');
const cheerio = require('cheerio');

let searchWord = '';

let siteTitle = '';

const title = new Set()
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

  //get data from website Posao
  $('.container a[href*="oglasi/"]').each((index, element) => {
    let posao_job = $(element).text()
    let posao_links = $(element).attr('href')
    title.add({posao_job, posao_links})
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
