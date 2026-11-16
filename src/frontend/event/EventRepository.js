export default class EventRepository { // defines the database operations for events
  async getAll() { // retrieves all events
    throw new Error("getAll() must be implemented");
  }

  async create(event) { // saves a new event
    throw new Error("create() must be implemented");
  }

  async update(id, event) { // updates an existing event
    throw new Error("update() must be implemented");
  }

  async delete(id) {
    throw new Error("delete() must be implemented");
  }
}