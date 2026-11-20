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

//Temporary placeholder times, may add a user setting dashboard if time
const STUDY_DAY_START = 10 * 60;
const STUDY_DAY_END = 19 * 60;
const EVENT_BUFFER_MINUTES = 30;


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

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateTimeString(date) {
  return `${dateKey(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;
}

function intervalsForDay(dayKey, events) {
  const day = dateFromKey(dayKey);
  const dayStart = day.getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  const windowStart = dayStart + STUDY_DAY_START * 60 * 1000;
  const windowEnd = dayStart + STUDY_DAY_END * 60 * 1000;
  const intervals = [];

  for (const event of events) {
    if (!event.start) continue;
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(event.start);
    if (event.allDay || isDateOnly) {
      const start = new Date(`${String(event.start).slice(0, 10)}T00:00:00`).getTime();
      const endKey = event.end ? String(event.end).slice(0, 10) : String(event.start).slice(0, 10);
      const endDate = dateFromKey(endKey);
      if (!event.end || endDate.getTime() <= start) endDate.setDate(endDate.getDate() + 1);
      if (start < dayEnd && endDate.getTime() > dayStart) intervals.push([windowStart, windowEnd]);
      continue;
    }

    const start = new Date(event.start).getTime();
    if (!Number.isFinite(start)) continue;
    const parsedEnd = event.end ? new Date(event.end).getTime() : start + 60 * 60 * 1000;
    if (!Number.isFinite(parsedEnd) || parsedEnd <= start) continue;
    const bufferedStart = Math.max(windowStart, start - EVENT_BUFFER_MINUTES * 60 * 1000);
    const bufferedEnd = Math.min(windowEnd, parsedEnd + EVENT_BUFFER_MINUTES * 60 * 1000);
    if (bufferedStart < bufferedEnd) intervals.push([bufferedStart, bufferedEnd]);
  }

  return intervals.sort((first, second) => first[0] - second[0]);
}

function findStudySlot(dayKey, durationMinutes, events, latestEnd = null) {
  const day = dateFromKey(dayKey);
  const dayStart = day.getTime();
  const windowStart = dayStart + STUDY_DAY_START * 60 * 1000;
  const windowEnd = Math.min(
    dayStart + STUDY_DAY_END * 60 * 1000,
    latestEnd ?? Infinity,
  );
  const duration = durationMinutes * 60 * 1000;
  let cursor = windowStart;

  for (const [busyStart, busyEnd] of intervalsForDay(dayKey, events)) {
    if (busyStart >= windowEnd) break;
    const clippedStart = Math.max(windowStart, busyStart);
    const clippedEnd = Math.min(windowEnd, busyEnd);
    if (clippedStart - cursor >= duration) return new Date(cursor);
    cursor = Math.max(cursor, clippedEnd);
  }
  return windowEnd - cursor >= duration ? new Date(cursor) : null;
}

function chooseSpreadDays(candidates, count, weekStart) {
  const remaining = [...candidates];
  const selected = [];
  for (let index = 0; index < count && remaining.length; index += 1) {
    const ideal = ((index + 0.5) * 7) / count - 0.5;
    let bestIndex = 0;
    let bestDistance = Infinity;
    remaining.forEach((candidate, candidateIndex) => {
      const offset = (dateFromKey(candidate).getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000);
      const distance = Math.abs(offset - ideal);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = candidateIndex;
      }
    });
    selected.push(remaining.splice(bestIndex, 1)[0]);
  }
  return selected.sort();
}

function buildStudyCalendarEvents(assignments, events) {
  const generated = [];
  const scheduled = [];
  const repeatingAssignments = assignments
    .filter((assignment) => assignment.repeat && !assignment.completed)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate));

  for (const assignment of repeatingAssignments) {
    const startKey = assignment.startDate;
    const dueKey = assignment.dueDate?.slice(0, 10);
    const daysPerWeek = Number(assignment.frequencyDays);
    const durationMinutes = Number(assignment.hoursPerDay) * 60;
    if (!startKey || !dueKey || startKey > dueKey || !Number.isInteger(daysPerWeek) || daysPerWeek < 1
      || !Number.isFinite(durationMinutes) || durationMinutes <= 0) continue;

    let weekStart = dateFromKey(startKey);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const dueDate = dateFromKey(dueKey);
    const dueAt = assignment.dueAt && assignment.dueAt.includes("T")
      ? new Date(assignment.dueAt).getTime()
      : null;

    while (weekStart <= dueDate) {
      const activeDays = [];
      for (let offset = 0; offset < 7; offset += 1) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + offset);
        const key = dateKey(day);
        if (key >= startKey && key <= dueKey) activeDays.push(key);
      }
      const target = Math.min(daysPerWeek, Math.ceil(daysPerWeek * activeDays.length / 7));
      const busyEvents = [...events, ...scheduled];
      const latestEndForDay = (key) => key === dueKey && Number.isFinite(dueAt) ? dueAt : null;
      const candidates = activeDays.filter((key) =>
        findStudySlot(key, durationMinutes, busyEvents, latestEndForDay(key))
      );
      const selectedDays = chooseSpreadDays(candidates, target, weekStart);
      let plannedCount = 0;

      for (const key of selectedDays) {
        const start = findStudySlot(
          key,
          durationMinutes,
          [...events, ...scheduled],
          latestEndForDay(key),
        );
        if (!start) continue;
        const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
        const session = {
          id: `study-${assignment.id}-${key}`,
          title: `Study: ${assignment.course}: ${assignment.title}`,
          start: dateTimeString(start),
          end: dateTimeString(end),
          color: "#356f9f",
          extendedProps: { type: "studySession", assignmentId: assignment.id },
        };
        generated.push(session);
        scheduled.push(session);
        plannedCount += 1;
      }

      if (plannedCount < target && activeDays.length) {
        generated.push({
          id: `study-warning-${assignment.id}-${dateKey(weekStart)}`,
          title: `⚠ Study plan short: ${plannedCount}/${target} days fit this week`,
          start: activeDays[0],
          allDay: true,
          color: "#c62828",
          extendedProps: { type: "studyWarning", assignmentId: assignment.id },
        });
      }

      weekStart.setDate(weekStart.getDate() + 7);
    }
  }
  return generated;
}

export default function Calendar() {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [showEventForm, setShowEventForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);


  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [assignmentError, setAssignmentError] = useState("");
  const [personalEvents, setPersonalEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
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
    
      fetch("/api/events")
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to load events.");
      return result;
    })
    .then((events) => {
      if (active) setPersonalEvents(events);
    })
    .catch((error) => {
      if (active) console.error("Unable to load events:", error);
    });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/events")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load events.");
        return result;
      })
      .then((savedEvents) => {
        if (active) setEvents(savedEvents.map((event) => ({
          ...event,
          id: `event-${event.id ?? event._id}`,
        })));
      })
      .catch((error) => {
        if (active) console.error("Unable to load calendar events:", error);
      });
    return () => { active = false; };
  }, []);





  const calendarEvents = [
    ...events,

    ...personalEvents
      .filter((event) =>
        event.title && !Number.isNaN(Date.parse(event.start))
      )
      .map((event) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: "#28644f",
      })),

    ...assignments.map((assignment) => ({
      id: `assignment-${assignment.id}`,
      title: `${assignment.course}: ${assignment.title}`,
      start: assignment.dueAt || assignment.dueDate,
      color: assignment.completed ? "#9ba6a2" : "#28644f",
      extendedProps: { type: "assignmentDue", assignmentId: assignment.id },
    })),
    ...buildStudyCalendarEvents(assignments, events),
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

  function handleEventSaved(event) {
    const savedEvent = {
      ...event,
      id: `event-${event.id ?? event._id}`,
    };
    setEvents((currentEvents) => {
      const existingIndex = currentEvents.findIndex((item) => item.id === savedEvent.id);
      if (existingIndex === -1) return [...currentEvents, savedEvent];
      return currentEvents.map((item) => item.id === savedEvent.id ? savedEvent : item);
    });
    setEditingEvent(null);
  }

  function handleCalendarEventClick(info) {
    const assignmentId = info.event.extendedProps.assignmentId
      ?? (info.event.id.startsWith("assignment-")
        ? info.event.id.slice("assignment-".length)
        : null);
    const assignment = assignments.find((item) => item.id === assignmentId);
    if (assignment) {
      setEditingAssignment(assignment);
      setShowAssignmentPopup(true);
      return;
    }
    const clickedEvent = events.find((event) => event.id === info.event.id);
    if (clickedEvent) {
      setEditingEvent(clickedEvent);
      setShowEventForm(true);
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
            setEditingEvent(null);
            setShowEventForm(true);
            setShowAddMenu(false);
            setEditingEvent(null);
          }}>
            Add Event
          </button>

        </div>
    )}


      {showEventForm && (
        <EventForm
          key={editingEvent?.id ?? "new-event"}
          initialEvent={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          onSaved={handleEventSaved}
        />
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
