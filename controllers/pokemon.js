const {gen, pokeData} = require('../helpers/helpers')

async function index (req, res) {
    try {
        let pokemonJSON;
        const gens = req.params.gen.split("-")
        pokemonJSON = await fetch(`https://pokeapi.co/api/v2/pokemon?${gen(gens)}`)
        const pokemon = await pokemonJSON.json()
        const names = pokemon.results.map(poke => poke.name)
        res.status(200).json(names)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function show (req, res) {
    try {
        const pokemonJSON = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`)
        const pokemon = await pokemonJSON.json()
        const result = {
            name: pokemon.name, 
            image: pokemon.sprites.other["official-artwork"].front_default
        }
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({err})
    }
}

module.exports = {index, show}
