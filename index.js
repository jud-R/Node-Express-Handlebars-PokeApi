const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser= require ("body-parser");
const to = require('await-to-js').default;


const Pokemon =  require ('./src/pokemon');
const pokemon = new Pokemon('https://pokeapi.co/api/v2/pokemon')
const PORT = process.env.PORT || 5003 ;
const app = express();

//MiddleWare
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs'}))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', async (req, res) => {
  let err, pokemons;
  [err,pokemons] = await to(pokemon.getAllPokemon());
  (!err && pokemons) ? res.render('home', { pokemons }) : res.redirect('notFound');
})

app.post('/search', (req, res) => {
    const search = req.body.search
    res.redirect(`/${search}`)
});

app.get('/notFound', (req, res) => {
  res.render('notFound')
});

app.get('/:pokemon', async (req, res) => {
  let err, pokemons;
  const search = req.params.pokemon;
  [err,pokemons] = await to(pokemon.getPokemon(search));
  (!err && pokemons) ? res.render('pokemon', { pokemon: pokemons }) : res.redirect('notFound');
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

