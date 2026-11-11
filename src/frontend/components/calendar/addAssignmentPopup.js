"use client";

import { useState } from "react";
import styles from "./addAssignmentPopup.module.css";


export default function AddAssignmentPopup({ isOpen, onClose }) {
  const [difficulty, setDifficulty] = useState(5);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("sample-1");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [frequencyDays, setFrequencyDays] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleSave = async () => {
    const dueDateTime = `${dueDate}T${dueTime}`;
  
    const assignmentData = {
	    title: title,
	    course: course,
	    description: description,
	    dueDate: dueDateTime,
      priority: priority,
	    difficulty: difficulty,
	    repeat: repeatEnabled,
	    hoursPerDay: repeatEnabled && hoursPerDay !== "" ? Number(hoursPerDay) : null,
	    frequencyDays: repeatEnabled && frequencyDays !== "" ? Number(frequencyDays) : null,
	    notes: notes
    };

    console.log("Assignment being saved:", assignmentData);

    const response = await fetch("/api/assignments", {
	    method: "POST",
	    headers: {
		    "Content-Type": "application/json"
	    },
	    body: JSON.stringify(assignmentData)
    });

    console.log("API status:", response.status);
    console.log("API response:", await response.json());
    
    if (!response.ok)
    {
	    throw new Error("Failed to save assignment");
    } 
    onClose();

  }

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
            <input type= "text" 
              value = {title}
              onChange={(e) => setTitle(e.target.value)}            
            />
          </label>

          <label className= {styles.row}>
            <span>Course Name</span>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
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
              id= "assignment-priority" 
              value ={priority}
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
                  type ="number" 
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
                type ="number" 
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
            rows ="4" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <div className ={styles.actions}>
            <button 
            className ={styles.saveButton} 
            type ="button" 
            onClick= {handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
