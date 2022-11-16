// const { MongoClient } = require('mongodb')
// const dotenv = require('dotenv')
// dotenv.config()
// const connectionUrl = process.env.MONGODB_URI
// const dbName = process.env.DB_NAME

// const init = async () => {
//   let client = await MongoClient.connect(connectionUrl)
//   console.log('connected to database!', dbName)
//   return client.db(dbName)
// }


// module.exports = { init };
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv').config();
const init = async () => {
  const uri = 'mongodb+srv://kakuna-matata:kakuna-matata@kakuna-matata.53iz8vb.mongodb.net/?retryWrites=true&w=majority';
  const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });



  //let dbName = process.env.NODE_ENV == "test" ? "quiz_dbtest" : "quiz_db";
  let dbName = "kakuna-matata";
  try {
    let client = await mongoClient.connect();
    console.log(`Your port is ${process.env.URI}`)
    return client.db(dbName);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {init};
