"use client";

import { useState } from "react";
import styles from "./EventForm.module.css";

function eventFormValues(event) {
  if (!event) return { title: "", eventDate: "", startTime: "", endTime: "", description: "" };
  const startDate = String(event.start ?? "").slice(0, 10);
  const endDate = String(event.end ?? "").slice(0, 10);
  const startTimeValue = typeof event.start === "string" ? event.start.match(/T(\d{2}:\d{2})/)?.[1] ?? "" : "";
  const endTimeValue = typeof event.end === "string" ? event.end.match(/T(\d{2}:\d{2})/)?.[1] ?? "" : "";
  const endIsNextMidnight = endDate !== startDate && endTimeValue === "00:00";
  const isLegacyEndOnly = event.startTimeProvided === undefined
    && startTimeValue === "00:00"
    && endDate === startDate
    && endTimeValue !== "00:00";

  return {
    title: event.title ?? "",
    eventDate: startDate,
    startTime: event.allDay || event.startTimeProvided === false || isLegacyEndOnly ? "" : startTimeValue,
    endTime: event.allDay || event.endTimeProvided === false || endIsNextMidnight ? "" : endTimeValue,
    description: event.description ?? "",
  };
}

export default function EventForm({ onClose, onSaved, initialEvent = null }) {
  const initialValues = eventFormValues(initialEvent);

  const [title, setTitle] = useState(initialValues.title);
  const [eventDate, setEventDate] = useState(initialValues.eventDate);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);
  const [description, setDesc] = useState(initialValues.description);
  const [errorMessage, setErrorMessage] = useState("");


const handleSubmit = async (e) =>
{
	e.preventDefault();
  setErrorMessage("");
  const eventData = {
    title,
    eventDate,
    startTime,
    endTime,
    description,
    ...(initialEvent ? { id: initialEvent._id ?? String(initialEvent.id).replace(/^event-/, "") } : {}),
  };

  try {
    const response = await fetch("/api/events", {
      method: initialEvent ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventData)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.error ?? "Failed to save event.");

    onSaved?.(result);
    onClose();
  } catch (error) {
    setErrorMessage(error.message || "Failed to save event.");
  }
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
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />


        <label> Event Date: </label>
          <input type="date" 
          placeholder="Select Event Date" 
          required
          value = {eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          />
        
        <label> Event Start Time (optional): </label>
          <input type="time" 
          placeholder="Select Event Start Time" 
          value = {startTime}
          onChange={(e) => setStartTime(e.target.value)}
          />

        <label> Event End Time (optional): </label>
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

        {errorMessage && <p className={styles.errorMessage} role="alert">{errorMessage}</p>}

        <button className={styles.saveButton} type="submit">
          {initialEvent ? "Save Changes" : "Save Event"}
        </button>

      </form>
    </div>
    </div>
  );
}
