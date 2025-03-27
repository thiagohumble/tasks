import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskCreated }) {
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
                    onTaskCreated(response.data);
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center">
                <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} className="form-checkbox h-5 w-5 text-sky-600" />
                <label className="ml-2">Concluído</label>
            </div>
            <div>
                <label className="block text-sm font-medium text-white">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium text-white">Descrição</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" />
            </div>
            <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">Criar tarefa</button>
        </form>
    );
}

export default TaskForm;