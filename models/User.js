const { init } = require("../dbConfig")
const { ObjectId } = require("mongodb");

class User {
  constructor(name = '', score = 0) {
    this.name = name;
    this.score = score;
  }

  static all() {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await init();
        const usersData = await db.collection("users").find().toArray();
        let users = usersData.map( user => new User({ ...user, id: user._id }));
        resolve(users);
      } catch (err) {
        reject("empty list");
      }
    });
  }

  static update(winner, loser) { // loser is just the username
    return new Promise(async (resolve, reject) => {
      try {
        const { name, score } = winner;
        const db = await init();
        const newLeaders = await db.collection("users").updateOne({name: loser}, { $set: { "name": name, "score": score } })
        resolve(newLeaders);
      } catch (err) {
        reject(`Error editing leaderboard: ${err}`);
      }
    });
  }

  static add(user) { // loser is just the username
    return new Promise(async (resolve, reject) => {
      try {
        const {name, score} = user
        const db = await init();
        const newLeaders = await db.collection("users").insertOne({ name: name, score: score })
        resolve(newLeaders);
      } catch (err) {
        reject(`Error editing leaderboard: ${err}`);
      }
    });
  }
}
  module.exports = User;
