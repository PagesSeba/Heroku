import MongoContainer from "../containers/mongoContainer.js";
import userSchema from "../models/user.js";

class UserDaoMongo extends MongoContainer {
  constructor() {
    super("user", userSchema);
  }

  async ifExist(username) {
    try {
      const user = await this.collection.findOne({ username });
      if (user) return true;
      return false;
    } catch (err) {
      logger.error(err);
    }
  }

  getByUsername = async (username) => {
    try {
      const user = await this.collection.findOne({ username });
      return user;
    } catch (error) {
      logger.error(error);
    }
  };

  getById = (id, done) => {
    try {
      this.collection.findById(id, done);
    } catch (error) {
      logger.error(error);
    }
  };
}

export default UserDaoMongo;
