import Assignment from "./Assignment";

export default class AssignmentService {
  constructor(repository) {
    this.repository = repository;
  }

  async listAssignments() {
    return this.repository.findAll();
  }

  async getAssignment(id) {
    return this.repository.findById(id);
  }

  async createAssignment(input) {
    const now = new Date();
    const assignment = new Assignment({ ...input, createdAt: now, updatedAt: now });
    return this.repository.insert(assignment);
  }

  async updateAssignment(id, input) {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const assignment = new Assignment({
      ...input,
      id,
      completed: existing.completed,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    return this.repository.update(id, assignment);
  }
}
