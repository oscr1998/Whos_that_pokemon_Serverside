

async function index (req, res) {
    try {
        let pokemonJSON;
        const gens = req.params.gen.split("-")
        if (gens.length == 1) {
            pokemonJSON = await fetch(`https://pokeapi.co/api/v2/pokemon?${gen(gens[0])}`)
        }
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

function gen (num) {
    let offset
    let limit
    switch(num) {
        case '1':
            offset = '0';
            limit = '151';
            break;
        case '2':
            offset = '151';
            limit = '100';
            break;
        case '3':
            offset = '251';
            limit = '135';
            break;
        case '4':
            offset = '386';
            limit = '108';
            break;
        case '5':
            offset = '494';
            limit = '155';
            break;
        case '6':
            offset = '649';
            limit = '72';
            break;
        case '7':
            offset = '721';
            limit = '88';
            break;
        case '8':
            offset = '809';
            limit = '96';
            break;
        default:
            break;
    }
    return `limit=${limit}&offset=${offset}`
}

module.exports = {index, show}
