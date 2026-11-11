import AssignmentApi from "./AssignmentApi";
import AssignmentService from "./AssignmentService";
import MongoAssignmentRepository from "./MongoAssignmentRepository";

export function createAssignmentApi() {
  const repository = new MongoAssignmentRepository();
  const service = new AssignmentService(repository);
  return new AssignmentApi(service);
}
