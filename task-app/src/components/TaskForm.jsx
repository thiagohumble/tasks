import React, { useState } from 'react';
import axios from 'axios';

function TaskForm() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.post('http://127.0.0.1:3001/tasks', { titulo: title, descricao: description })
		.then(() => {
			setTitle('');
			setDescription('');
		})
		.catch(error => console.error(error));
	};

	return (
		<form onSubmit={handleSubmit}>
		<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
		<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
		<button type="submit">Create Task</button>
		</form>
		);
}

export default TaskForm;