"use client";

import { useState } from "react";
import styles from "./EventForm.module.css";
export default function EventForm({ onClose, onSaved, initialEvent }) {

  const [title, setTitle] = useState(initialEvent?.title ?? "");

  const [eventDate, setEventDate] = useState(
    initialEvent?.start?.slice(0, 10) ?? ""
  );

  const [startTime, setStartTime] = useState(
    initialEvent?.start?.slice(11, 16) ?? ""
  );

  const [endTime, setEndTime] = useState(
    initialEvent?.end?.slice(11, 16) ?? ""
  );

  const [description, setDesc] = useState(
    initialEvent?.description ?? ""
  );


const handleSubmit = async (e) =>
{
	e.preventDefault();
  const start = `${eventDate}T${startTime}`;
  const end = `${eventDate}T${endTime}`;

  const eventData = {
	  title: title,
	  start: start,
	  end: end,
  	description: description
  };



  const isEditing = Boolean(initialEvent?._id);

  const response = await fetch("/api/events", {
  method: isEditing ? "PATCH" : "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(
    isEditing
      ? { ...eventData, id: initialEvent._id }
      : eventData
  )
});




  if (!response.ok)
  {
    throw new Error("Failed to save event");
  }
  
  const savedEvent = await response.json();
  onSaved(savedEvent);
};


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
      <h2>{initialEvent ? "Edit Event" : "Add Event"}</h2>

      <form className={styles.form} onSubmit={handleSubmit}> 

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

        <button className={styles.saveButton} type="submit">
          {initialEvent ? "Update Event" : "Save Event"}
        </button>

      </form>
    </div>
    </div>
  );
}