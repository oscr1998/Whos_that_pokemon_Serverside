const { init } = require("../dbConfig")
const { ObjectId } = require("mongodb");

class User {
  constructor(data) {
    this.name = data.name;
    this.score = data.score;
  }

  static all() {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await init();
        const usersData = await db.collection("users").find().toArray();
        let users = usersData.map(
          (user) => new User({ ...user, id: user._id })
        );
        resolve(users);
      } catch (err) {
        reject("empty list");
      }
    });
  }
}
  module.exports = User;
