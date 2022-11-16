const request = require("supertest");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
// const { init } = require("../../dbConfig/init.js");
const app = require("../../server");
const connectionUrl = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const init = async () => {
    let client = await MongoClient.connect(connectionUrl);
    console.log("connected to database!", dbName);
    return client.db(dbName);
};

const resetTestDB = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await init();
            await db.collection("users").removeMany({});
            await db.collection("users").insertOne([
                {   
                    _id: ObjectId("608bbf4eb17a10129faef1b9"),
                    name: "Player1",
                    score: 1,
                },
            ]);
            resolve("Test DB reset");
        } catch (err) {
            reject(`Test DB could not be reset: ${err} in ${err.file}`);
        }
    });
};

global.request = request;
global.app = app;
global.resetTestDB = resetTestDB;
global.port = process.env.PORT || 5000;
