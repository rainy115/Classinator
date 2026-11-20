export default class EventApi { // connects API requests to the event service
  constructor(eventService) {
    this.eventService = eventService;
  }

  async getEvents() {
    return await this.eventService.getAllEvents();
  }

  async createEvent(data) {
    return await this.eventService.createEvent(data);
  }

  async updateEvent(id, data) {
    return await this.eventService.updateEvent(id, data);
  }

  async deleteEvent(id) {
    return await this.eventService.deleteEvent(id);
  }
}
