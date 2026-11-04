"use client";

import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import { useState } from "react";
import AddAssignmentPopup from "../components/calendar/addAssignmentPopup";
// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE

export default function Calendar() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  return (
    <>
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
      left: "prev,next today",
      center: "title",
      right: "addButton,dayGridMonth,timeGridWeek,timeGridDay"
      }}
      events= {[
        {
          title: 'Test event 1',
          start: '2026-11-01',
          color: "blue"
        },
        {
          title: 'event2',
          start: '2026-11-05',
          end: '2026-11-07'
        }
      ]}
      eventClick={(info) =>{
        alert("Event: " + info.event.title) 
        // Currently displays the event title on click, change to edit assigment/ personal event
      }}
      dateClick={(info) => {
        alert("Clicked on:" + info.dateStr);
      }}
      buttons={{
        addButton: {
          text: "+",
          click: () => setShowAddMenu(!showAddMenu)
        }
      }}
    />
    {showAddMenu && (
      <div>
        <button onClick={() => setShowAssignmentPopup(true)}>
          Add Assignment
          </button>
          <button onClick={() => alert("Add Event clciked")}>
            Add Event
          </button>
        </div>
    )}
    <AddAssignmentPopup
      isOpen={showAssignmentPopup}
      onClose={() => setShowAssignmentPopup(false)}
    />
  </>
  );
} 
