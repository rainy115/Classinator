import { ObjectId } from "mongodb"; // // handles event storage and retrieval using MongoDB
import { getDatabase } from "../lib/mongodb";
import EventRepository from "./EventRepository";

export default class MongoEventRepository extends EventRepository {

  async getAll() {
    const db = await getDatabase();
    return await db.collection("events").find({}).toArray();
  }

  async create(event) { // eturn the saved event with its generated MongoDB ID
    const db = await getDatabase();
    const result = await db.collection("events").insertOne(event);

    return { ...event, _id: result.insertedId };
  }

  async update(id, event) { // find the event by ID and update its fields
    const db = await getDatabase();

    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: event }
    );

    return result;
  }

  async delete(id) {
    const db = await getDatabase();

    return await db.collection("events").deleteOne({
      _id: new ObjectId(id)
    });
  }
}
