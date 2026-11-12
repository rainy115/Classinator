//Ricky - timeline view UI logic

"use client";

import styles from "./TimelineView.module.css";
import TimelineService from "../../timeline/TimelineService";

function formatDay(date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day:"numeric",
	});
}

export default function TimelineView({ tasks, events, onBack }) {
	const timeline = new TimelineService(tasks,events);

	if (timeline.isEmpty()) {
		return (
			<section className={styles.timeline}>
				<button className={styles.backButton} onClick={onBack}>Back to Calendar</button>
				<h1>Timeline</h1>
				<p>Nothing scheduled yet.</p>
			</section>

		);
	}

	
	const days = timeline.getDays();

	return (
		<section className={styles.timeline}>
			<button className={styles.backButton} onClick={onBack}>Back to Calendar</button>
			<h1>Timeline</h1>
			<div className={styles.dates}>
				{days.map((day) => (
					<span key={formatDay(day)} style={{ left: `${timeline.getPercent(day)}%` }}>
						{formatDay(day)}
					</span>
				))}
			</div>
			{timeline.items.map((item, i) => (
				<div className={styles.row} key={i}>
					<div
						className={`${styles.bar} ${item.type === "assignment" ? styles.assignment : styles.event}`}
						style={{left: `${timeline.getPercent(item.start)}%`, width: `${timeline.getPercent(item.end) - timeline.getPercent(item.start)}%`}}
						title={item.hover}
					>
						{item.title}
					</div>
				</div>

			))}
		</section>
	);
}
