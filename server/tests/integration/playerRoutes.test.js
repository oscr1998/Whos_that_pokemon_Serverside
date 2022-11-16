describe("users endpoints", () => {
    let api;
    beforeEach(async () => {
        await resetTestDB();
        console.log("reset");
    });

    beforeAll(async () => {
        api = app.listen(5000, () =>
            console.log("Test app running on port 5000")
        );
    });

    afterAll(async () => {
        console.log("Gracefully stopping test app");
        await api.close();
    });

    it("should retrieve all users", async () => {
        const res = await request(api).get("/users");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

   
});
