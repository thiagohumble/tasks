import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskCreated }) { // Adicionado prop onTaskCreated
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('https://task-api-sswf.onrender.com/tasks', { title, description, done })
            .then(response => {
                setDone(false);
                setTitle('');
                setDescription('');
                if (onTaskCreated) {
                    onTaskCreated(response.data); // Chama a função para atualizar a lista
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" />
            <button type="submit">Criar tarefa</button>
        </form>
    );
}

export default TaskForm;