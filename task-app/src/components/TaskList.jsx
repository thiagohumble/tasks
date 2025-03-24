import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		axios.get('http://127.0.0.1:3001/tasks')
		.then(response => setTasks(response.data))
		.catch(error => console.error(error));
	}, []);

	return (
		<div>
		<h1>Task List</h1>
			<ul>
				{tasks.map(task => (
					<li key={task.id}>{task.title}</li>
				))}
			</ul>
		</div>
		);
}

export default TaskList;