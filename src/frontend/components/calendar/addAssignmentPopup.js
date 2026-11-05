"use client";

import { useState } from "react";
import styles from "./addAssignmentPopup.module.css";

export default function AddAssignmentPopup({ isOpen, onClose }) {
  const [difficulty, setDifficulty] = useState(5);
  const [repeatEnabled, setRepeatEnabled] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className= {styles.popup} role="dialog" aria-modal="true" aria-label="New or edit assignment">
        <header className = {styles.header}>
          <h2>New Assignment / Edit Assignment</h2>
        </header>
        <div className= {styles.form}>
          <label className ={styles.row}>
            <span>Assignment Name</span>
            <input type= "text" />
          </label>

          <label className= {styles.row}>
            <span>Course Name</span>
            <select defaultValue="sample-1">
              <option value= "sample-1">Sample 1</option>
              <option value = "sample-2">Sample 2</option>
            </select>
          </label>

          <label className={`${styles.row} ${styles.descriptionRow}`}>
            <span>Description</span>
            <textarea rows="3" />
          </label>

          <label className={styles.row}>
            <span>Due Date</span>
            <input type="date" />
          </label>

          <div className={styles.row}>
            <span>Due Time</span>
            <input type="time" step="60" aria-label="Due time" />
          </div>

          <div className={styles.priorityRow}>
            <label htmlFor="assignment-priority">Priority?</label>
            <select id= "assignment-priority" defaultValue = "Medium">
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
                <input type ="number" min="0.25" max="24" step="0.25" disabled={!repeatEnabled} />
              </label>
              <label>
                <span>Frequency of days:</span>
                <input type ="number" min="1" step="1" disabled={!repeatEnabled} />
              </label>
            </div>
          </fieldset>

          <label className ={`${styles.row} ${styles.notesRow}`}>
            <span>Notes</span>
            <textarea rows ="4" />
          </label>

          <div className ={styles.actions}>
            <button className ={styles.saveButton} type ="button" onClick= {onClose}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
