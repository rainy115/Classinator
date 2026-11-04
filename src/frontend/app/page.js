"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { useState } from "react";
import TasksDueView from "./tasks/TasksDueView";

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME

const initialTasks = [
  { id: 1, title: "Quiz 01", course: "CS 321", dueDate: "2026-11-04", completed: false },
  { id: 2, title: "Homework 3", course: "MATH 213", dueDate: "2026-11-05", completed: false },
  { id: 3, title: "Project 1", course: "CS 310", dueDate: "2026-11-07", completed: false },
];

export default function Calendar() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const calendarEvents = [
    {
      title: 'Test event 1',
      start: '2026-11-01',
      color: "blue",
    },
    {
      title: 'event2',
      start: '2026-11-05',
      end: '2026-11-07',
    },
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `${task.course}: ${task.title}`,
      start: task.dueDate,
      color: task.completed ? "#9ba6a2" : "#28644f",
    })),
  ];

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }

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
      events={calendarEvents}
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
        <button onClick={() => alert("Add Assignment clicked")}>
          Add Assignment
          </button>
          <button onClick ={() => alert("Add Event clciked")}>
            Add Event
          </button>
        </div>
    )}
      <TasksDueView tasks={tasks} onToggleTask={toggleTask} />
  </>
  );
} 
