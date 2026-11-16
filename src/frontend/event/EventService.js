import Event from "./Event"; 

// handles event operations and validation

export default class EventService {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents() {
    return await this.eventRepository.getAll();
  }

  async createEvent(data) { // build and validate the event before saving
    const event = new Event(
      data.title,
      data.start,
      data.end,
      data.description
    );

    this.validateEvent(event);

    return await this.eventRepository.create(event);
  }

  async updateEvent(id, data) { // validate the event before updating
    const event = new Event(
      data.title,
      data.start,
      data.end,
      data.description
    );

    this.validateEvent(event);

    return await this.eventRepository.update(id, event);
  }

  async deleteEvent(id) {
    return await this.eventRepository.delete(id);
  }

  validateEvent(event) {
    if (!event.title?.trim()) {
      throw new Error("Event title is required");
    }

    if (!event.start || !event.end ||
        Number.isNaN(Date.parse(event.start)) ||
        Number.isNaN(Date.parse(event.end))) {
      throw new Error("Valid event start and end times are required");
    }

    if (new Date(event.end) <= new Date(event.start)) {
      throw new Error("Event must end after it starts");
    }
  }
}
