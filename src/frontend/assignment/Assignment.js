import Course from "./Course";
import StudySchedule from "./StudySchedule";

/** Domain model for an assignment saved by a student. */
export default class Assignment {
  constructor(data = {}) {
    this.id = data.id ?? data._id?.toString?.() ?? null;
    this.title = data.title?.trim?.() ?? "";
    this.course = Course.from(data.course, data.courseId, data.courseName);
    this.description = data.description ?? "";
    this.dueDate = data.dueDate;
    this.priority = data.priority ?? "Medium";
    this.difficulty = Number(data.difficulty ?? 5);
    this.studySchedule = StudySchedule.fromAssignmentData(data);
    this.notes = data.notes ?? "";
    this.completed = Boolean(data.completed);
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toDocument() {
    return {
      title: this.title,
      course: this.course?.name ?? "",
      courseId: this.course?.id ?? null,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      difficulty: this.difficulty,
      repeat: this.studySchedule.enabled,
      hoursPerDay: this.studySchedule.hoursPerDay,
      frequencyDays: this.studySchedule.frequencyDays,
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
      courseName: this.course?.name ?? "",
    };
  }
}
