//Ricky - timeline view UI logic

"use client";

import { useState } from "react";

import styles from "./TimelineView.module.css";
import TimelineService from "../../timeline/TimelineService";

function formatDay(date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day:"numeric",
	});
}

function getToday() {
	const today = new Date();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${today.getFullYear()}-${month}-${day}`;
}

export default function TimelineView({ tasks, events, onBack }) {
	const [fromDate, setFromDate] = useState(getToday());
	const [toDate, setToDate] = useState("");

	const timeline = new TimelineService(tasks, events, fromDate, toDate);

	return (
		<section className={styles.timeline}>
			<button className={styles.backButton} onClick={onBack}>Back to Calendar</button>
			<h1>Timeline</h1>

			<div className={styles.range}>
				<label>From <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></label>
				<label>To <input type="date" value={toDate} min={fromDate} onChange={(e) => setToDate(e.target.value)} /></label>
			</div>

			{timeline.isEmpty() && <p>Nothing scheduled between these dates.</p>}

			{!timeline.isEmpty() &&(
				<>
					<div className={styles.dates}>
						{timeline.getDays().map((day) => (
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
				</>
			)}
			
		</section>
	);
}
