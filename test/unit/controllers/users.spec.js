const usersController = require('../../../controllers/users')
const User = require('../../../models/User');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson, end: jest.fn() }))
const mockRes = { status: mockStatus }

describe('users controller', () => {
    beforeEach(() =>  jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('getAllUsers', () => {
        test('it returns users with a 200 status code', async () => {
            let testUsers = ['d1', 'd2']
            jest.spyOn(User, 'all')
                 .mockResolvedValue(testUsers);
            await usersController.getAllUsers(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUsers);
        })
    });

    describe('update', () => {
        test('it updates a user with a 200 status code', async () => {
            let userData = { 
                name: 'Test 3 User', 
                score: 254 }
            jest.spyOn(User, 'update')
                .mockResolvedValue(new User(userData));
                
            const mockReq = { currentUser: { id: 2 },  body: userData }
            await usersController.update(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(userData));
        })
    });

    describe('add', () => {
        test('it returns a new user with a 200 status code', async () => {
            let userData = { 
                name: 'Test 2 User', 
                score: 234 }
            jest.spyOn(User, 'add')
                .mockResolvedValue(new User(userData));
                
            const mockReq = { currentUser: { id: 3 },  body: userData }
            await usersController.add(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(userData));
        })
    });
})
