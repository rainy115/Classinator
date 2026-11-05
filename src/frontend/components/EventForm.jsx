"use client";

import { useState } from "react";
export default function EventForm() {

  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Saving event:", title);
  }

  return (

    <div className="event-popup">

      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}> //onsubmit instead of click j in case user presses enter instead of clicking save button

        <label> Event Name: </label>
          <input
            type="text"
            placeholder="Enter event name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <p>You entered: {title}</p>

        <label> Event Date: </label>
          <input type="date" placeholder="Select Event Date" />
        
        <label> Event Start Time: </label>
          <input type="time" placeholder="Select Event Start Time" />

        <label> Event End Time: </label>
          <input type="time" placeholder="Select Event End Time" />

        <label> Event Description: </label>
        <textarea placeholder="Enter Event Description" />

        <button type="submit">Save Event</button>

      </form>
    </div>
  );
}