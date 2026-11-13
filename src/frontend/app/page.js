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
  { title: 'Test event 1', start: '2026-11-13T10:00', color: "blue" },
  { title: 'event2', start: '2026-11-17T09:00', end: '2026-11-19T17:00' },
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
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [assignmentError, setAssignmentError] = useState("");
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
        if (active) setAssignmentError(error.message || "Unable to load assignments.");
      })
      .finally(() => {
        if (active) setIsLoadingAssignments(false);
      });
    return () => { active = false; };
  }, []);


  const calendarEvents = [
    ...events,
    ...assignments.map((assignment) => ({
      id: `assignment-${assignment.id}`,
      title: `${assignment.course}: ${assignment.title}`,
      start: assignment.dueAt || assignment.dueDate,
      color: assignment.completed ? "#9ba6a2" : "#28644f",
    })),
  ];

  async function toggleTask(assignmentId) {
    const assignment = assignments.find((item) => item.id === assignmentId);
    if (!assignment) return;

    setAssignmentError("");
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !assignment.completed }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to update assignment.");

      const updatedAssignment = toTask(result);
      setAssignments((currentAssignments) => currentAssignments.map((item) =>
        item.id === assignmentId ? updatedAssignment : item
      ));
    } catch (error) {
      setAssignmentError(error.message || "Unable to update assignment.");
    }
  }

  function handleAssignmentSaved(assignment) {
    const savedTask = toTask(assignment);
    setAssignmentError("");
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
    return <TimelineView tasks={assignments} events={events} onBack={() => setShowTimeline(false)} />;
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
      <TasksDueView
        tasks={assignments}
        isLoading={isLoadingAssignments}
        error={assignmentError}
        onToggleTask={toggleTask}
      />
    <AddAssignmentPopup
      isOpen={showAssignmentPopup}
      initialAssignment={editingAssignment}
      onClose={() => setShowAssignmentPopup(false)}
      onSaved={handleAssignmentSaved}
    />
  </>
  );
} 
