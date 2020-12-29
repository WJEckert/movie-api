require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./movie-list.js')

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN

  if (bearerToken !== apiToken) {
           return res.status(401).json({ error: 'Unauthorized request' })
   };
    next();
})

app.get('/movies', function HandleGetMovies(req, res ){
    let movieSearch = [...movies];
    const {genre, country, avg_vote} = req.query;
    if (genre){
        if (genre.toLowerCase() !== 'animation' && genre.toLowerCase() !== 'drama' && genre.toLowerCase() !== 'romantic' && genre.toLowerCase() !== 'comedy'
            && genre.toLowerCase() !== 'spy' && genre.toLowerCase() !== 'crime' && genre.toLowerCase() !== 'thriller' && genre.toLowerCase() !== 'adventure'
            && genre.toLowerCase() !== 'documentary' && genre.toLowerCase() !== 'horror' && genre.toLowerCase() !== 'action' && genre.toLowerCase() !== 'western' && genre.toLowerCase() !== 'history'
            && genre.toLowerCase() !== 'biography' && genre.toLowerCase() !== 'musical' && genre.toLowerCase() !== 'fantasy' && genre.toLowerCase() !== 'war' && genre.toLowerCase() !== 'grotesque')
        {
            return res.status(400).send('Genre must be Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Fantasy, Grotesque, History, Horror, Musical, Romantic, Spy, War or Western ')
        }
        movieSearch = movieSearch.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase())
        })
    }

    if (country) {
       movieSearch = movieSearch.filter(movie => {
           return movie.country.toLowerCase().includes(country.toLowerCase())
       })
    }

    if (avg_vote) {
        movieSearch = movieSearch.filter(movie => {
            return movie.avg_vote >= avg_vote
        })
    }


  res.json(movieSearch)
})

const PORT = 9000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})