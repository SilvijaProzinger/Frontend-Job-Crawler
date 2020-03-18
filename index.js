const axios = require('axios');
const cheerio = require('cheerio');

const SEARCH_WORD = 'frontend';

const pageOne = `http://www.posao.hr/poslovi/izraz/${SEARCH_WORD}`;
const pageTwo = `http://www.moj-posao.net/Pretraga-Poslova/?searchWord=frontend&keyword=${SEARCH_WORD}`;

reqOne = () => axios.get(pageOne)
reqTwo = () => axios.get(pageTwo)

let siteTitle = "";

const title = new Set()
const titleTwo = new Set()

const fetchData = async () => {
  const [resultOne, resultTwo] = await axios.all([reqOne(), reqTwo()])
  const bodyOne = resultOne.data
  const bodyTwo = resultTwo.data

  const body = bodyOne + bodyTwo

  return cheerio.load(body)
}

const getResults = async() => {
  $ = await fetchData()

	siteTitle = `Job results for ${SEARCH_WORD}`

  //get data from website Posao
  $('.container a').each((index, element) => {
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

  /*//show jobs from Moj-Posao
  $MojPosao('.job').find('.general-info').each(function ()
   	{
      links.push({
        title: $MojPosao(this).find('.job-title').text(),
        location: $MojPosao(this).find('.job-location').text(),
        deadline: $MojPosao(this).find('.deadline').text(),
        company: $MojPosao(this).find('.job-company').text()
      });
	 }
  )

  //show featured jobs
  $MojPosao('#featured-jobs').find('.column').each(function ()
   	{
      links.push({
        title: $MojPosao(this).find('.job-position').text(),
        location: $MojPosao(this).find('.job-location').text(),
        deadline: $MojPosao(this).find('.deadline').text(),
        company: $MojPosao(this).find('img').attr('title')
      });
	  }
  )
	*/
  console.log(title, titleTwo)

  return {
  	title: [...title],
  	titleTwo: [...titleTwo],
  	siteTitle
  }
}

module.exports = getResults