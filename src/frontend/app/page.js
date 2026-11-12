"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { useEffect, useState } from "react";

import EventForm from "../components/EventForm";

import TasksDueView from "./tasks/TasksDueView";
import TimelineView from "./timeline/TimelineView";

import AddAssignmentPopup from "../components/calendar/addAssignmentPopup";

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME

const events = [
  { title: 'Test event 1', start: '2026-11-01T10:00', color: "blue" },
  { title: 'event2', start: '2026-11-05T09:00', end: '2026-11-07T17:00' },
];

const initialTasks = [
  { id: 1, title: "Quiz 01", course: "CS 321", dueDate: "2026-11-04", completed: false },
  { id: 2, title: "Homework 3", course: "MATH 213", dueDate: "2026-11-05", completed: false },
  { id: 3, title: "Project 1", course: "CS 310", dueDate: "2026-11-07", completed: false },
];

function toTask(assignment) {
  const dueAt = assignment.dueDate ?? "";
  return {
    ...assignment,
    id: String(assignment.id ?? assignment._id),
    course: assignment.courseName ?? assignment.course ?? "",
    dueDate: dueAt.split("T")[0],
    dueAt,
  };
}

export default function Calendar() {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [showEventForm, setShowEventForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [assignments, setAssignments] = useState([]);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/assignments")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load assignments.");
        return result;
      })
      .then((assignments) => {
        if (active) setAssignments(assignments.map(toTask));
      })
      .catch((error) => {
        if (active) console.error("Unable to load calendar assignments:", error);
      });
    return () => { active = false; };
  }, []);


  const calendarEvents = [
    ...events,
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `${task.course}: ${task.title}`,
      start: task.dueAt || task.dueDate,
      color: task.completed ? "#9ba6a2" : "#28644f",
    })),
    ...assignments.map((assignment) => ({
      id: `assignment-${assignment.id}`,
      title: `${assignment.course}: ${assignment.title}`,
      start: assignment.dueAt || assignment.dueDate,
      color: assignment.completed ? "#9ba6a2" : "#28644f",
    })),
  ];

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }

  function handleAssignmentSaved(assignment) {
    const savedTask = toTask(assignment);
    setAssignments((currentAssignments) => {
      const existingIndex = currentAssignments.findIndex((item) => item.id === savedTask.id);
      if (existingIndex === -1) return [...currentAssignments, savedTask];
      return currentAssignments.map((item) => item.id === savedTask.id ? savedTask : item);
    });
  }

  function handleCalendarEventClick(info) {
    const assignmentId = info.event.id.startsWith("assignment-")
      ? info.event.id.slice("assignment-".length)
      : null;
    const assignment = assignments.find((item) => item.id === assignmentId);
    if (assignment) {
      setEditingAssignment(assignment);
      setShowAssignmentPopup(true);
      return;
    }
    alert("Event: " + info.event.title);
  }

 

  if (showTimeline) {
    return <TimelineView tasks={[...tasks, ...assignments]} events={events} onBack={() => setShowTimeline(false)} />;
  }

  return (
    <>
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
      left: "prev,next today timelineButton",
      center: "title",
      right: "addButton,dayGridMonth,timeGridWeek,timeGridDay"
      }}
      events={calendarEvents}
      eventClick={handleCalendarEventClick}
      dateClick={(info) => {
        alert("Clicked on:" + info.dateStr);
      }}
      buttons={{
        addButton: {
          text: "+",
          click: () => setShowAddMenu(!showAddMenu)
        },
        timelineButton: {
          text: "Timeline",
          click: () => setShowTimeline(true)
        }
      }}
    />
    {showAddMenu && (
      
      <div className="add-menu">

        <button onClick={() => {
          setEditingAssignment(null);
          setShowAssignmentPopup(true);
          setShowAddMenu(false);
        }}>
          Add Assignment
          </button>

          <button onClick={() => {
            setShowEventForm(true);
            setShowAddMenu(false);
          }}>
            Add Event
          </button>

        </div>
    )}
      {showEventForm && (
        <EventForm onClose={() => setShowEventForm(false)} />
    )}
      <TasksDueView tasks={tasks} onToggleTask={toggleTask} />
    <AddAssignmentPopup
      isOpen={showAssignmentPopup}
      initialAssignment={editingAssignment}
      onClose={() => setShowAssignmentPopup(false)}
      onSaved={handleAssignmentSaved}
    />
  </>
  );
} 
