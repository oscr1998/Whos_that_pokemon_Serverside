const User = require('../../../models/User');
const mongodb = require('mongodb');
jest.mock('mongodb');

const db = require('../../../dbConfig');

describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('all', () => {
        test('it resolves with users on successful db query', async () => {
            const all = await User.all;
            expect(all).toHaveLength(1)
        })
    });
})
