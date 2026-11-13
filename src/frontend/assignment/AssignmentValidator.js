const PRIORITIES = new Set(["High", "Medium", "Low"]);

export default class AssignmentValidator {
  validate(input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) input = {};

    const errors = {};
    const title = typeof input.title === "string" ? input.title.trim() : "";
    const course = typeof input.course === "string" ? input.course.trim() : "";
    const dueDate = typeof input.dueDate === "string" ? input.dueDate.trim() : "";
    const difficulty = Number(input.difficulty);
    const repeat = Boolean(input.repeat ?? input.studySchedule?.enabled);
    const hoursPerDay = Number(input.hoursPerDay ?? input.studySchedule?.hoursPerDay);
    const frequencyDays = Number(input.frequencyDays ?? input.studySchedule?.frequencyDays);

    if (!title) errors.title = "Enter an assignment name.";
    if (title.length > 160) errors.title = "Assignment name must be 160 characters or fewer.";
    if (!course || course.toLowerCase() === "(select a course)") {
      errors.course = "Select a course.";
    }
    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      errors.dueDate = "Enter a valid due date and time.";
    }
    if (!PRIORITIES.has(input.priority)) {
      errors.priority = "Choose High, Medium, or Low priority.";
    }
    if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 10) {
      errors.difficulty = "Difficulty must be a whole number from 1 to 10.";
    }
    if (repeat && (
      !Number.isFinite(hoursPerDay)
      || hoursPerDay < 0.25
      || hoursPerDay > 24
      || Math.abs(hoursPerDay * 4 - Math.round(hoursPerDay * 4)) > 1e-8
    )) {
      errors.hoursPerDay = "Hours per day must be between 0.25 and 24.";
    }
    if (repeat && (!Number.isInteger(frequencyDays) || frequencyDays < 1)) {
      errors.frequencyDays = "Frequency of days must be a positive whole number.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      value: {
        ...input,
        title,
        course,
        courseId: input.course ?? input.courseId,
        courseName: input.courseName ?? input.course,
        dueDate,
        difficulty,
        repeat,
        hoursPerDay: repeat ? hoursPerDay : null,
        frequencyDays: repeat ? frequencyDays : null,
        description: typeof input.description === "string" ? input.description.trim() : "",
        notes: typeof input.notes === "string" ? input.notes.trim() : "",
      },
    };
  }
}
