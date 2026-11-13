import { ObjectId } from "mongodb";
import { getDatabase } from "../lib/mongodb";
import Assignment from "./Assignment";
import AssignmentRepository from "./AssignmentRepository";

export default class MongoAssignmentRepository extends AssignmentRepository {
  async collection() {
    const database = await getDatabase();
    return database.collection("assignments");
  }

  async findAll() {
    const collection = await this.collection();
    const documents = await collection.find({}).toArray();
    return documents.map((document) => new Assignment(document));
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    const collection = await this.collection();
    const document = await collection.findOne({ _id: new ObjectId(id) });
    return document ? new Assignment(document) : null;
  }

  async insert(assignment) {
    const collection = await this.collection();
    const document = assignment.toDocument();
    const result = await collection.insertOne(document);
    return new Assignment({ ...document, id: result.insertedId.toString() });
  }

  async update(id, assignment) {
    if (!ObjectId.isValid(id)) return null;
    const collection = await this.collection();
    const document = assignment.toDocument();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...document, createdAt: assignment.createdAt, updatedAt: new Date() } },
    );
    if (result.matchedCount === 0) return null;
    return this.findById(id);
  }
}
