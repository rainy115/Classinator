const PRIORITIES = new Set(["High", "Medium", "Low"]);

export default class AssignmentValidator {
  validate(input = {}) {
    if (!input || typeof input !== "object" || Array.isArray(input)) input = {};

    const errors = {};
    const title = typeof input.title === "string" ? input.title.trim() : "";
    const course = typeof input.course === "string" ? input.course.trim() : "";
    const dueDate = typeof input.dueDate === "string" ? input.dueDate.trim() : "";
    const startDate = typeof input.startDate === "string" ? input.startDate.trim() : "";
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
      || hoursPerDay > 9
      || Math.abs(hoursPerDay * 4 - Math.round(hoursPerDay * 4)) > 1e-8
    )) {
      errors.hoursPerDay = "Time per day must be between 0.25 and 9 hours.";
    }
    if (repeat && (!Number.isInteger(frequencyDays) || frequencyDays < 1 || frequencyDays > 7)) {
      errors.frequencyDays = "Frequency must be a whole number from 1 to 7 days per week.";
    }
    if (repeat && (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || Number.isNaN(Date.parse(startDate)))) {
      errors.startDate = "Choose a valid start date for the study sessions.";
    }
    if (repeat && startDate && dueDate && startDate > dueDate.slice(0, 10)) {
      errors.startDate = "Start date must be on or before the due date.";
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
        startDate: repeat ? startDate : null,
        description: typeof input.description === "string" ? input.description.trim() : "",
        notes: typeof input.notes === "string" ? input.notes.trim() : "",
      },
    };
  }
}
