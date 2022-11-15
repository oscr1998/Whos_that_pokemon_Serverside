const pokeData = [
    {
        offset : 0,
        num: 151
    },
    {
        offset : 151,
        num: 251
        // num: 100
    },
    {
        offset : 251,
        num: 386
        // num: 135
    },
    {
        offset : 386,
        num: 494
        // num: 108
    },
    {
        offset : 494,
        num: 649
        // num: 155
    },
    {
        offset : 649,
        num: 721
        // num: 72
    },
    {
        offset : 721,
        num: 809
        // num: 88
    },
    {
        offset : 809,
        num: 905
        // num: 96
    },
] 

function gen ([first_gen, second_gen=first_gen]) {
    let offset
    let limit
    switch(first_gen) {
        case '1':
            offset = pokeData[0].offset;
            break;
        case '2':
            offset = pokeData[1].offset; 
            break;
        case '3':
            offset = pokeData[2].offset;
            break;
        case '4':
            offset = pokeData[3].offset;
            break;
        case '5':
            offset = pokeData[4].offset;
            break;
        case '6':
            offset = pokeData[5].offset;
            break;
        case '7':
            offset = pokeData[6].offset;
            break;
        case '8':
            offset = pokeData[7].offset;
            break;
        default:
            break;
    }
    switch(second_gen) {
        case '1':
            limit = pokeData[0].num - offset;
            break;
        case '2':
            limit = pokeData[1].num - offset;
            break;
        case '3':
            limit = pokeData[2].num - offset;
            break;
        case '4':
            limit = pokeData[3].num - offset;
            break;
        case '5':
            limit = pokeData[4].num - offset;
            break;
        case '6':
            limit = pokeData[5].num - offset;
            break;
        case '7':
            limit = pokeData[6].num - offset;
            break;
        case '8':
            limit = pokeData[7].num - offset;
            break;
        default:
            break;
    }
    return `limit=${limit}&offset=${offset}`
}

module.exports = {gen, pokeData}
