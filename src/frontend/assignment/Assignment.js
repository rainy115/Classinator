/** Domain model for an assignment saved by a student. */
export default class Assignment {
  constructor(data = {}) {
    this.id = data.id ?? data._id?.toString?.() ?? null;
    this.title = data.title?.trim?.() ?? "";
    this.courseId = data.courseId ?? data.course ?? "";
    this.courseName = data.courseName ?? data.course ?? "";
    this.course = this.courseName;
    this.description = data.description ?? "";
    this.dueDate = data.dueDate;
    this.priority = data.priority ?? "Medium";
    this.difficulty = Number(data.difficulty ?? 5);
    this.repeat = Boolean(data.repeat);
    this.hoursPerDay = this.repeat ? data.hoursPerDay ?? null : null;
    this.frequencyDays = this.repeat ? data.frequencyDays ?? null : null;
    this.notes = data.notes ?? "";
    this.completed = Boolean(data.completed);
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toDocument() {
    return {
      title: this.title,
      course: this.course,
      courseId: this.courseId,
      courseName: this.courseName,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      difficulty: this.difficulty,
      repeat: this.repeat,
      hoursPerDay: this.hoursPerDay,
      frequencyDays: this.frequencyDays,
      notes: this.notes,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toJSON() {
    return {
      id: this.id,
      ...this.toDocument(),
    };
  }
}
