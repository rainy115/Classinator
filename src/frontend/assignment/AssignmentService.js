import Assignment from "./Assignment";
import AssignmentValidator from "./AssignmentValidator";

export class AssignmentValidationError extends Error {
  constructor(errors) {
    super("Assignment data is invalid.");
    this.name = "AssignmentValidationError";
    this.errors = errors;
  }
}

export default class AssignmentService {
  constructor(repository, validator = new AssignmentValidator()) {
    this.repository = repository;
    this.validator = validator;
  }

  validateInput(input) {
    const result = this.validator.validate(input);
    if (!result.valid) throw new AssignmentValidationError(result.errors);
    return result.value;
  }

  async listAssignments() {
    const assignments = await this.repository.findAll();
    return assignments.sort((first, second) => {
      const firstDue = Date.parse(first.dueDate);
      const secondDue = Date.parse(second.dueDate);
      return (Number.isNaN(firstDue) ? Infinity : firstDue)
        - (Number.isNaN(secondDue) ? Infinity : secondDue);
    });
  }

  async getAssignment(id) {
    return this.repository.findById(id);
  }

  async createAssignment(input) {
    const values = this.validateInput(input);
    const now = new Date();
    const assignment = new Assignment({
      ...values,
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.insert(assignment);
  }

  async updateAssignment(id, input) {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const updatedData = {
      ...existing.toJSON(),
      ...input,
      id,
      completed: typeof input.completed === "boolean" ? input.completed : existing.completed,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    const values = this.validateInput(updatedData);

    const assignment = new Assignment({ ...values, id, completed: updatedData.completed });
    return this.repository.update(id, assignment);
  }
}
