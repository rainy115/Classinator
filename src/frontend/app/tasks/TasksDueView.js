"use client";

import styles from "./TasksDueView.module.css";

function formatDueDate(dateString) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

export default function TasksDueView({ tasks, onToggleTask }) {

	return (
		<section className={styles.deadlines}>
			<h1 className={styles.heading}>Upcoming Deadlines</h1>
			<ul className={styles.list}>
				{tasks.map((task) => (
					<li className={styles.task} key={task.id}>
						<label className={styles.taskDetails}>
							<input
								className={styles.checkbox}
								checked={task.completed}
								onChange={() => onToggleTask(task.id)}
								type="checkbox"
							/>
							<span className={styles.taskText}>
								<span className={styles.title}>{task.title}</span>
								<span className={styles.course}>{task.course}</span>
							</span>
						</label>
						<time className={styles.dueDate} dateTime={task.dueDate}>
							{formatDueDate(task.dueDate)}
						</time>
					</li>
				))}
			</ul>
		</section>
	);
}
