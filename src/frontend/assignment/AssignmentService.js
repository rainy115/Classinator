import Assignment from "./Assignment";

export class AssignmentValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssignmentValidationError";
  }
}

function validateAssignment(input) {
  if (typeof input.title !== "string" || !input.title.trim()) {
    throw new AssignmentValidationError("Assignment name is required.");
  }

  if (typeof input.dueDate !== "string" || !input.dueDate || Number.isNaN(Date.parse(input.dueDate))) {
    throw new AssignmentValidationError("A valid due date is required.");
  }
}

export default class AssignmentService {
  constructor(repository) {
    this.repository = repository;
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
    validateAssignment(input);
    const now = new Date();
    const assignment = new Assignment({
      ...input,
      title: input.title.trim(),
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
      title: typeof input.title === "string" ? input.title.trim() : existing.title,
      completed: typeof input.completed === "boolean" ? input.completed : existing.completed,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    validateAssignment(updatedData);

    const assignment = new Assignment(updatedData);
    return this.repository.update(id, assignment);
  }
}
