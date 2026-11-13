import AssignmentApi from "./AssignmentApi";
import AssignmentService from "./AssignmentService";
import AssignmentValidator from "./AssignmentValidator";
import MongoAssignmentRepository from "./MongoAssignmentRepository";

export function createAssignmentApi() {
  const repository = new MongoAssignmentRepository();
  const validator = new AssignmentValidator();
  const service = new AssignmentService(repository, validator);
  return new AssignmentApi(service);
}
