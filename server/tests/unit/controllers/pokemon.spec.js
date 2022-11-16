const pokemonController = require('../../../controllers/pokemon')

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('pokemon controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        test('it returns pokemons with a 200 status code', async () => {
            await pokemonController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
        })
    });

})
