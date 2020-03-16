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

  //get content from each page with cheerio
  const $Posao = cheerio.load(bodyOne);
  const $MojPosao = cheerio.load(bodyTwo);

  return [$Posao, $MojPosao]
  console.log($Posao, $MojPosao)
}

const getResults = async() => {
	const $ = await fetchData()

	siteTitle = `Job results for ${SEARCH_WORD}`

	//show jobs from Posao
  	$('.container a').each((index, element) => {
  		title.add($(element).text())
  	})

  	$('.job .general-info').each((index, element) => {
  		titleTwo.add($(element).text())
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