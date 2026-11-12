//Ricky - timeline view business logic

function formatTime(date){
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function isValid(date){
  return !isNaN(new Date(date));
}

function getDueTime(task){
  return task.dueAt?.includes("T") ? task.dueAt : task.dueDate + "T23:59";
}

export default class TimelineService {
  constructor(tasks, events) {
    
    this.items = [
      ...tasks.map((task) => ({
        title: `${task.course}: ${task.title}`,
        start: `${task.dueDate}T00:00`,
        end: getDueTime(task),
        type: "assignment",
        hover: "Due " + formatTime(getDueTime(task) ),
      })),

      ...events.map((event) => ({
        title: event.title,
        start: event.start,
        end: isValid(event.end)? event.end : event.start,
        type: "event",
        hover: isValid(event.end)? formatTime(event.start) + " to " + formatTime(event.end) : formatTime(event.start),
      })),
    ].filter((item) => isValid(item.start));

    this.items.sort((first, second) => first.start.localeCompare(second.start));
  }

  isEmpty() { 
    return this.items.length === 0;

  }

  getFirstDay() {
    const firstDay = new Date(this.items[0].start);
    firstDay.setHours(0,0,0,0);

    return firstDay;
  }

  getLastDay() {
    const lastDay = new Date(Math.max(...this.items.map((item) => new Date(item.end))));
    
    lastDay.setDate(lastDay.getDate() + 1);
    lastDay.setHours(0,0,0,0);

    return lastDay;
  }

  getDays() {
    const days = [];
    const lastDay = this.getLastDay();

    for (let day = this.getFirstDay(); day < lastDay; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }

    return days;
  }

  getPercent(date) {
    const firstDay = this.getFirstDay();
    const lastDay = this.getLastDay();
    return ((new Date(date) - firstDay)/(lastDay - firstDay))*100;
    
  }
}
