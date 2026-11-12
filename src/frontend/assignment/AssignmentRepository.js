/** Storage contract for assignment persistence implementations. */
export default class AssignmentRepository {
  async findAll() {
    throw new Error("findAll() must be implemented by a repository.");
  }

  async findById() {
    throw new Error("findById() must be implemented by a repository.");
  }

  async insert() {
    throw new Error("insert() must be implemented by a repository.");
  }

  async update() {
    throw new Error("update() must be implemented by a repository.");
  }
}
