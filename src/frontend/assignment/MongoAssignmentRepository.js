import { ObjectId } from "mongodb";
import { getDatabase } from "../lib/mongodb";
import Assignment from "./Assignment";
import AssignmentRepository from "./AssignmentRepository";
import { AssignmentConflictError } from "./AssignmentService";

let assignmentIndexPromise;

export default class MongoAssignmentRepository extends AssignmentRepository {
  async collection() {
    const database = await getDatabase();
    const collection = database.collection("assignments");
    if (!assignmentIndexPromise) {
      assignmentIndexPromise = collection.createIndex(
        { course: 1, title: 1 },
        {
          unique: true,
          collation: { locale: "en", strength: 2 },
          name: "unique_course_assignment_title",
        },
      ).catch((error) => {
        assignmentIndexPromise = undefined;
        throw error;
      });
    }
    await assignmentIndexPromise;
    return collection;
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
    try {
      const result = await collection.insertOne(document);
      return new Assignment({ ...document, id: result.insertedId.toString() });
    } catch (error) {
      if (error.code === 11000) throw new AssignmentConflictError();
      throw error;
    }
  }

  async update(id, assignment) {
    if (!ObjectId.isValid(id)) return null;
    const collection = await this.collection();
    const document = assignment.toDocument();
    let result;
    try {
      result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...document, createdAt: assignment.createdAt, updatedAt: new Date() } },
      );
    } catch (error) {
      if (error.code === 11000) throw new AssignmentConflictError();
      throw error;
    }
    if (result.matchedCount === 0) return null;
    return this.findById(id);
  }
}
