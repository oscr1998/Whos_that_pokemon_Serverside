const request = require("supertest");
// const app = require("../../app.js");
// const fs = require("fs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// const testSeed = fs.readFileSync(__dirname + '/test_seeds.js').toString();
const connectionUrl = process.env.MONGODB_URI;
// ? process.env.DB_CONNECTION : "mongodb://127.0.0.1:27017/telegraph";
console.log(connectionUrl);
const dbName = process.env.DB_NAME;

const data = [
    {
      name: "player1",
      score: 123,
    },
    {
      name: "player2",
      score: 234,
    },
  ];

function resetTestDB () {
    return new Promise(async (resolve, reject) => {
        try {
          let client = await MongoClient.connect(connectionUrl);
          client.db(dbName).collection("test").deleteMany( { } );
          client.db(dbName).collection("test").insertMany(data)
          resolve("Test DB")
        } catch (err) {
          reject(`Test DB could not be reset: ${err}`);
        }
    
        console.log("connected to database!", dbName);
        // return client.db(dbName)
      });
};


global.request = request;
// global.app = app;
// global.resetTestDB = resetTestDB;
global.port = process.env.PORT || 5000;
module.exports =  resetTestDB 
