//!          Movie database search app
// api key https://www.omdbapi.com/?i=tt3896198&apikey=3f958806

//?     config for reusable api call

const config = {
  renderOption(movie) {
    // taking care of no poster URLs
    if (movie.Poster === 'N/A') movie.Poster = '';
    movie.Poster;
    return `
      <img src="${movie.Poster}">
      ${movie.Title} ${movie.Year}
    `;
  },
  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/',
      // api parameters -- s is just search includes(movieName), i  is all the info about 1 movie
      {
        params: {
          apikey: '3f958806',
          s: searchTerm
        }
      } 
    )
    if (response.data.Error) return []
    return response.data.Search
  }
}


//?    left and right widget on CALL

searchEngine( {
  ...config,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})
searchEngine( {
  ...config,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})



//*     Fetching the selected movie info ON CLICK

let leftMovie, rightMovie;


const onMovieSelect = async (movie, domElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/',
    {
      params: {
        apikey: '3f958806',
        i: movie.imdbID
      }
    }
  )
  domElement.innerHTML = movieTemplate(response.data)

  //*   checking to see which side argument we received 

  if (side === 'left') leftMovie = response.data;
  rightMovie = response.data;

  if (leftMovie && rightMovie) {
    runComparison()
  }
  

}

//*     func to check between sides

const runComparison = () => {
  // getting all notification article divs
  const leftSide = document.querySelectorAll('#left-summary .notification')
  const rightSide = document.querySelectorAll('#right-summary .notification')

  leftSide.forEach( (leftStat, index) => {
    const rightStat = rightSide[index]

    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    }
    else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  });
}
  

//*            TEMPLATE for movies

const movieTemplate = (movieDetail) => {

  //* turning api results to COMPARABLE NUMBERS

  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metaScore = parseInt(movieDetail.Metascore)
  const imdb = parseFloat(movieDetail.imdbRating)
  const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  // AWARDS.split returns an array of each word
  
  const awards = movieDetail.Awards.split(' ')
  .reduce((prev, word) => {
    const value = parseInt(word)

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value
    }
  }, 0)
  
  //*   HTML TEMPLATE

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}">
        </p>
      </figure>
      <div class="media-content>
        <div class="content>
          <h1> ${movieDetail.Title} </h1>
          <h4> ${movieDetail.Genre} </h4>
          <p> ${movieDetail.Plot} </p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="title"> ${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title"> ${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title"> ${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdb} class="notification is-primary">
      <p class="title"> ${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${votes} class="notification is-primary">
      <p class="title"> ${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}


