const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const fetch= require('node-fetch')
const helpers= require('handlebars-helpers')(['string'])
const bodyParser= require ("body-parser")

const PORT = process.env.PORT || 5003 

const app = express()

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error)

const getAllPokemon = catchErrors(async() => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const json = await res.json()
    console.table(json.results)
    return json
})

const getPokemon = catchErrors(async (pokemon ='1') => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const json = await res.json()
    console.table(json.results)
    return json
})


//MiddleWare
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', catchErrors(async (req, res) => {
    const pokemons = await getAllPokemon()
    console.log(pokemons.results[0])
    res.render('home', {pokemons})
    })
)

app.post('/search', (req, res) => {
    const search = req.body.search
    res.redirect(`/${search}`)
})

app.get('/notFound', (_, res) => res.render('notFound'))

app.get(
    '/:pokemon',
    catchErrors(async (req, res) => {
        const search = req.params.pokemon
        const pokemon = await getPokemon(search)
        pokemon ? res.render('pokemon', { pokemon }) : res.redirect('notFound')
}))


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

