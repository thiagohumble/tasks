import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskCreated }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [done, setDone] = useState(false);
    const [apiMessage, setApiMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(true);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        let isValid = true;
        if (!title.trim()) {
            setTitleError('Título é Obrigatório');
            isValid = false;
        } else {
            setTitleError('');
        }

        if (!description.trim()) {
            setDescriptionError('Descrição é obrigatória');
            isValid = false;
        } else {
            setDescriptionError('');
        }

        if (isValid) {
            axios.post('https://task-api-sswf.onrender.com/tasks', { title, description, done })
            .then(response => {
                setDone(false);
                setTitle('');
                setDescription('');
                setTasks(response.data);
                setApiMessage('Tarefa ' + response.data.title + ' criada com sucesso.');
                setTimeout(() => {
                    setIsMessageVisible(false);
                    setTimeout(() => setApiMessage(''), 700); 
                }, 8000);

                if (onTaskCreated) {
                    onTaskCreated(response.data);
                }
            })
            .catch(error => console.error(error));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center">
                    <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} className="form-checkbox h-5 w-5 text-sky-600" />
                    <label className="ml-2">Concluído</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Título</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" required/>
                    {titleError && <p className="text-red-500 text-xs italic">{titleError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Descrição</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="mt-1 p-2 w-full bg-gray-800 border border-gray-700 rounded text-white" required/>
                    {descriptionError && <p className="text-red-500 text-xs italic">{descriptionError}</p>}
                </div>
                <button type="submit" className="bg-sky-600 cursor-pointer hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">Criar tarefa</button>
            </form>

            {apiMessage && (
                <div className={`my-5 bg-gray-200 p-4 rounded-md text-black transition duration-700 ${isMessageVisible ? 'opacity-100' : 'opacity-0'} `}>
                    {apiMessage}
                </div>
            )}
        </>
    );
}

export default TaskForm; 