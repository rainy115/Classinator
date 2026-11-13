/** Scheduling preferences saved with one assignment. */
export default class StudySchedule {
  constructor({ enabled = false, hoursPerDay = null, frequencyDays = null } = {}) {
    this.enabled = Boolean(enabled);
    this.hoursPerDay = this.enabled ? hoursPerDay : null;
    this.frequencyDays = this.enabled ? frequencyDays : null;
  }

  static fromAssignmentData(data = {}) {
    const schedule = data.studySchedule ?? {};
    return new StudySchedule({
      enabled: schedule.enabled ?? data.repeat ?? false,
      hoursPerDay: schedule.hoursPerDay ?? data.hoursPerDay ?? null,
      frequencyDays: schedule.frequencyDays ?? data.frequencyDays ?? null,
    });
  }
}
