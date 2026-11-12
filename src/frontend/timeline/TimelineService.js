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
  constructor(tasks, events, fromDate, toDate) {
    
    this.fromDate = fromDate;
    this.toDate = toDate;

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

    if (fromDate) {
      this.items = this.items.filter((item) => new Date(item.end) >= new Date(fromDate + "T00:00"));
    }

    if (toDate) {
      this.items = this.items.filter((item) => new Date(item.start) <= new Date(toDate + "T23:59"));
    }

    this.items.sort((first, second) => first.start.localeCompare(second.start));
  }

  isEmpty() { 
    return this.items.length === 0;

  }

  getFirstDay() {
    let firstDay = new Date(this.items[0].start);
    if (this.fromDate) {
      firstDay = new Date(this.fromDate + "T00:00");
    }
    firstDay.setHours(0,0,0,0);

    return firstDay;
  }

  getLastDay() {
    let lastDay = new Date(Math.max(...this.items.map((item) => new Date(item.end))));
    if (this.toDate) {
      lastDay = new Date(this.toDate + "T00:00");
    }

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
    let percent = ((new Date(date) - firstDay)/(lastDay - firstDay))*100;

    if (percent < 0) {
      percent = 0;
    }
    if (percent > 100) {
      percent = 100;
    }

    return percent;
  }
}
