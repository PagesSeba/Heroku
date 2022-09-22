import config from "../config.js";
import mongoose from "mongoose";
import logger from "../loggers.js";

await mongoose.connect(config.mongodb.connectionString);

class MongoContainer {
  constructor(collectionName, schema) {
    this.name = collectionName;
    this.collection = mongoose.model(collectionName, schema);
  }

  // Realizar CRUD (Create, Read, Update, Delete)

  create = async (req, res) => {
    try {
      let itemInModel;
      switch (this.name) {
        case "carritos":
          itemInModel = new this.collection({
            timestamp: Date.now().toString(),
            products: [],
          });
          await itemInModel.save();
          res.json(itemInModel);
          break;
        default:
          itemInModel = new this.collection({
            timestamp: Date.now().toString(),
            ...req.body,
          });
          await itemInModel.save();
          return itemInModel;
      }
    } catch (error) {
      logger.error(error);
    }
  };

  getAll = async (req, res) => {
    try {
      const itemsCollection = await this.collection.find();
      const items = itemsCollection.map((item) => ({
        id: item._doc._id.toString(),
        ...item._doc,
      }));
      res.json(items);
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (req, res) => {
    try {
      const item = await this.collection.find({ _id: { $eq: req.params.id } });
      res.json(item);
    } catch (error) {
      logger.error(error);
    }
  };

  update = async (req, res) => {
    try {
      await this.collection.updateOne(
        { _id: req.params.id },
        { $set: { ...req.body } }
      );
      res.sendStatus(200);
    } catch (error) {
      logger.error(error);
    }
  };

  delete = async (req, res) => {
    try {
      await this.collection.deleteOne({ _id: req.params.id });
      res.sendStatus(200);
    } catch (error) {
      logger.error(error);
    }
  };
}

export default MongoContainer;
