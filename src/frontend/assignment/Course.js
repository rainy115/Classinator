/** Course selected for an assignment. */
export default class Course {
  constructor(id, name = id) {
    this.id = id;
    this.name = name;
  }

  static from(value, id = null, name = null) {
    if (value && typeof value === "object") {
      return new Course(value.id ?? id ?? value.name, value.name ?? name ?? value.id);
    }

    const courseId = id ?? value;
    return courseId ? new Course(courseId, name ?? value ?? courseId) : null;
  }
}
