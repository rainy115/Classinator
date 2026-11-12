//Ricky - adding timeline view

"use client";

import styles from "./TimelineView.module.css";

function formatDay(date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day:"numeric",
	});
}

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

export default function TimelineView({ tasks, events, onBack }) {
	const items = [
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

	items.sort((first, second) => first.start.localeCompare(second.start));

	if (items.length === 0) {
		return (
			<section className={styles.timeline}>
				<button className={styles.backButton} onClick={onBack}>Back to Calendar</button>
				<h1>Timeline</h1>
				<p>Nothing scheduled yet.</p>
			</section>
			
		);
	}

	const firstDay = new Date(items[0].start);
	firstDay.setHours(0,0,0,0);

	const lastDay = new Date(Math.max(...items.map((item) => new Date(item.end))));
	lastDay.setDate(lastDay.getDate() + 1);
	lastDay.setHours(0,0,0,0);

	function percent(date) {
		return ((new Date(date) - firstDay)/(lastDay - firstDay))*100;

	}

	const days = [];
	for (let day = new Date(firstDay); day < lastDay; day.setDate(day.getDate() + 1)) {
		days.push(new Date(day));
	}

	return (
		<section className={styles.timeline}>
			<button className={styles.backButton} onClick={onBack}>Back to Calendar</button>
			<h1>Timeline</h1>
			<div className={styles.dates}>
				{days.map((day) => (
					<span key={formatDay(day)} style={{ left: `${percent(day)}%` }}>
						{formatDay(day)}
					</span>
				))}
			</div>
			{items.map((item, i) => (
				<div className={styles.row} key={i}>
					<div
						className={`${styles.bar} ${item.type === "assignment" ? styles.assignment : styles.event}`}
						style={{left: `${percent(item.start)}%`, width: `${percent(item.end) - percent(item.start)}%`}}
						title={item.hover}
					>
						{item.title}
					</div>
				</div>
				
			))}
		</section>
	);
}
