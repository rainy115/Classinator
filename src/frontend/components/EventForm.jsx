"use client";

import { useState } from "react";
import styles from "./EventForm.module.css";
export default function EventForm({ onClose }) {

  const [title, setTitle] = useState("");

  return (

    <div 
        className={styles.backdrop}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }
    }>

        <div className={styles.popup}>
      <h2>Add Event</h2>

      <form className={styles.form}> 

        <label> Event Name: </label>
          <input
            type="text"
            placeholder="Enter event name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />


        <label> Event Date: </label>
          <input type="date" placeholder="Select Event Date" />
        
        <label> Event Start Time: </label>
          <input type="time" placeholder="Select Event Start Time" />

        <label> Event End Time: </label>
          <input type="time" placeholder="Select Event End Time" />

        <label> Event Description: </label>
        <textarea placeholder="Enter Event Description" />

        <button className={styles.saveButton} type="submit">Save Event</button>

      </form>
    </div>
    </div>
  );
}