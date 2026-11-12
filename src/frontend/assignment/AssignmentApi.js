export default class AssignmentApi {
  constructor(service) {
    this.service = service;
  }

  async list() {
    return this.service.listAssignments();
  }

  async create(input) {
    return this.service.createAssignment(input);
  }

  async getById(id) {
    return this.service.getAssignment(id);
  }

  async update(id, input) {
    return this.service.updateAssignment(id, input);
  }
}
