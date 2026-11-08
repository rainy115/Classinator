"use client";

import { useState } from "react";
import styles from "./EventForm.module.css";
export default function EventForm({ onClose }) {

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDesc] = useState("");



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
          <input type="date" 
          placeholder="Select Event Date" 
          value = {eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          />
        
        <label> Event Start Time: </label>
          <input type="time" 
          placeholder="Select Event Start Time" 
          value = {startTime}
          onChange={(e) => setStartTime(e.target.value)}
          />

        <label> Event End Time: </label>
          <input type="time" 
          placeholder="Select Event End Time" 
          value = {endTime}
          onChange={(e) => setEndTime(e.target.value)}
          />

        <label> Event Description: </label>
        <textarea
          placeholder="Enter Event Description"
          value={description}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className={styles.saveButton} type="submit">Save Event</button>

      </form>
    </div>
    </div>
  );
}