"use client";

import { useState } from "react";
import styles from "./addAssignmentPopup.module.css";

const EMPTY_FORM = {
  title: "",
  course: "sample-1",
  description: "",
  dueDate: "",
  dueTime: "",
  priority: "Medium",
  difficulty: 5,
  repeat: false,
  hoursPerDay: "",
  frequencyDays: "",
  notes: "",
};

function toFormValues(assignment) {
  if (!assignment) return EMPTY_FORM;
  const [dueDate = "", dueTime = ""] = (assignment.dueAt ?? assignment.dueDate ?? "").split("T");
  return {
    title: assignment.title ?? "",
    course: assignment.courseId ?? assignment.course ?? "sample-1",
    description: assignment.description ?? "",
    dueDate,
    dueTime: dueTime.slice(0, 5),
    priority: assignment.priority ?? "Medium",
    difficulty: Number(assignment.difficulty ?? 5),
    repeat: Boolean(assignment.repeat),
    hoursPerDay: assignment.hoursPerDay ?? "",
    frequencyDays: assignment.frequencyDays ?? "",
    notes: assignment.notes ?? "",
  };
}

export default function AddAssignmentPopup(props) {
  if (!props.isOpen) return null;
  return (
    <AssignmentPopupContent
      key={props.initialAssignment?.id ??"new-assignment"}
      {...props}
    />
  );
}

function AssignmentPopupContent({ isOpen, initialAssignment = null, onClose, onSaved }) {
  const initialValues = toFormValues(initialAssignment);
  const [difficulty, setDifficulty] = useState(() => initialValues.difficulty);
  const [repeatEnabled, setRepeatEnabled] = useState(() => initialValues.repeat);
  const [title, setTitle] = useState(() => initialValues.title);
  const [course, setCourse] = useState(() => initialValues.course);
  const [description, setDescription] = useState(() => initialValues.description);
  const [dueDate, setDueDate] = useState(() => initialValues.dueDate);
  const [dueTime, setDueTime] = useState(() => initialValues.dueTime);
  const [priority, setPriority] = useState(() => initialValues.priority);
  const [hoursPerDay, setHoursPerDay] = useState(() => initialValues.hoursPerDay);
  const [frequencyDays, setFrequencyDays] = useState(() => initialValues.frequencyDays);
  const [notes, setNotes] = useState(() => initialValues.notes);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    const assignmentData = {
      title,
      course,
      courseName: course === "sample-1" ? "Sample 1" : course === "sample-2" ? "Sample 2" : course,
      description,
      dueDate: dueTime ? `${dueDate}T${dueTime}` : dueDate,
      priority,
      difficulty,
      repeat: repeatEnabled,
      hoursPerDay: repeatEnabled && hoursPerDay !== "" ? Number(hoursPerDay) : null,
      frequencyDays: repeatEnabled && frequencyDays !== "" ? Number(frequencyDays) : null,
      notes,
    };

    try {
      const response = await fetch(
        initialAssignment ? `/api/assignments/${initialAssignment.id}` : "/api/assignments",
        {
          method: initialAssignment ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assignmentData),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save assignment.");
      }
      onSaved?.(result);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "Unable to save assignment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className= {styles.popup} role="dialog" aria-modal="true" aria-label="New or edit assignment">
        <header className={styles.header}>
          <h2>{initialAssignment ? "Edit Assignment" : "New Assignment"}</h2>
        </header>
        <form className={styles.form} onSubmit={handleSave} noValidate>
          <label className={styles.row}>
            <span>Assignment Name</span>
            <input type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className={styles.row}>
            <span>Course Name</span>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {!['sample-1', 'sample-2'].includes(course) && <option value={course}>{course}</option>}
              <option value="sample-1">Sample 1</option>
              <option value="sample-2">Sample 2</option>
            </select>
          </label>

          <label className={`${styles.row} ${styles.descriptionRow}`}>
            <span>Description</span>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className={styles.row}>
            <span>Due Date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          <div className={styles.row}>
            <span>Due Time</span>
            <input
              type="time"
              step="60"
              aria-label="Due time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>

          <div className={styles.priorityRow}>
            <label htmlFor="assignment-priority">Priority?</label>
            <select
              id="assignment-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <label htmlFor="assignment-difficulty">Difficulty?</label>
            <div className={styles.difficultyControl}>
              <input  
                id="assignment-difficulty"
                type="range"
                min="1"
                max="10"
                step="1"
                value={difficulty}
                onChange={(event ) => setDifficulty(Number( event.target.value))}
                aria-label="Difficulty from 1 to 10"
              />
              <output htmlFor="assignment-difficulty">{difficulty}</output>
            </div>
          </div>

          <fieldset className={styles.repeatSection}>
            <legend>
              <label className={styles.repeatToggle}>
                <input
                  type="checkbox"
                  checked={repeatEnabled}
                  onChange={(event) => setRepeatEnabled(event.target.checked)}
                />
                Repeat over multiple days?
              </label>
            </legend>
            <div className={styles.frequencySettings}>
              <strong>Frequency Settings:</strong>
              <label>
                <span>Time per day (hours):</span>
                <input
                  type="number"
                  min="0.25"
                  max="24"
                  step="0.25"
                  disabled={!repeatEnabled}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                />
              </label>
              <label>
                <span>Frequency of days:</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  disabled={!repeatEnabled}
                  value={frequencyDays}
                  onChange={(e) => setFrequencyDays(e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <label className ={`${styles.row} ${styles.notesRow}`}>
            <span>Notes</span>
            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {errorMessage && <p role="alert">{errorMessage}</p>}
          <div className={styles.actions}>
            <button className={styles.saveButton} type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : initialAssignment ? "Save Changes" : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
