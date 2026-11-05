//Ricky - adding timeline view 

"use client";

import styles from "./TimelineView.module.css";

export default function TimelineView({ tasks, events, onBack }) {
	const items = [
		...tasks.map((task) => ({
			title: task.course + ": " + task.title,
			date: task.dueDate + "T23:59", // due end of day
			type: "Assignment",
		})),
		...events.map((event) => ({
			title: event.title,
			date: event.start,
			type: "Event",
		})),
	];

	items.sort((a, b) => a.date.localeCompare(b.date));

	return (
		<section className={styles.timeline}>
			<button onClick={onBack}>Back to Calendar</button>
			<h1>Timeline</h1>
			<ul className={styles.list}>
				{items.map((item, i) => (
					<li className={styles.item} key={i}>
						<span>{new Date(item.date).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}</span>
						<span>{item.title}</span>
						<span>{item.type}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
