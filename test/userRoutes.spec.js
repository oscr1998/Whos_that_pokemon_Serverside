const app = require("../server");
const resetTestDB = require("./config")
describe("user endpoints", () => {
  let api;
  beforeEach(async () => {
    await resetTestDB();
  });

  beforeAll(async () => {
    api = app.listen(5000, () =>
      console.log("Test server running on port 5000")
    );
  });

  afterAll((done) => {
    console.log("Gracefully stopping test server");
    api.close(done);
  });

  it('responds to get / witha status of 200', (done) => {
    request(api).get('/').expect(200, done);
})

  it("should return a list of users from db", async () => {
    const res = await request(api).get("/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
  });
});
