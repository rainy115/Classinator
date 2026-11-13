export default class Event { // represents a personal event with its basic details
  constructor(title, start, end, description = "") {
    this.title = title;
    this.start = start;
    this.end = end;
    this.description = description;
  }
}