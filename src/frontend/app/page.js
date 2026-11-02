"use client";

import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE
import client from "react-dom/client";

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
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
    />
  );
} 
