import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDone, setEditedDone] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('https://task-api-sswf.onrender.com/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    };

    const handleEdit = (task) => {
        setEditingTaskId(task.id);
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedDone(task.done);
    };

    const handleSave = (id) => {
        axios.put(`https://task-api-sswf.onrender.com/tasks/${id}`, {
            title: editedTitle,
            description: editedDescription,
            done: editedDone
        })
            .then(() => {
                setEditingTaskId(null);
                fetchTasks();
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (id) => {
        axios.delete(`https://task-api-sswf.onrender.com/tasks/${id}`)
            .then(() => fetchTasks())
            .catch(error => console.error(error));
    };

    const handleDone = (id) => {
        axios.patch(`https://task-api-sswf.onrender.com/tasks/${id}/done`)
            .then(() => fetchTasks())
            .catch(error => console.error(error));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-8 text-sky-500">Task List</h1>
            <div className="w-full max-w-4xl">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-2">ID</th>
                            <th className="p-2">Título</th>
                            <th className="p-2">Descrição</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Criado em</th>
                            <th className="p-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id} className="border-b border-gray-700">
                                <td className="p-2">{task.id}</td>
                                <td className="p-2">
                                    {editingTaskId === task.id ? (
                                        <input type="text" value={editedTitle} onChange={(e) => 
                                        setEditedTitle(e.target.value)} className="bg-gray-800 text-white p-1" />
                                    ) : (
                                        task.title
                                    )}
                                </td>
                                <td className="p-2">
                                    {editingTaskId === task.id ? (
                                        <textarea value={editedDescription} onChange={(e) => 
                                        setEditedDescription(e.target.value)} className="bg-gray-800 text-white p-1" />
                                    ) : (
                                        task.description
                                    )}
                                </td>
                                <td className="p-2">
                                    {editingTaskId === task.id ? (
                                        <label className="inline-flex items-center">
                                            <input type="checkbox" checked={editedDone} onChange={(e) => 
                                            setEditedDone(e.target.checked)} className="form-checkbox h-5 w-5 text-sky-600" />
                                            <span className="ml-2">Concluído</span>
                                        </label>
                                    ) : (
                                        task.done ? 'Concluída' : 'Pendente'
                                    )}
                                </td>
                                <td className="p-2">{task.createdAt}</td>
                                <td className="p-2 space-x-2">
                                    {editingTaskId === task.id ? (
                                        <button onClick={() => handleSave(task.id)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded">Salvar</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(task)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">Editar</button>
                                            <button onClick={() => handleDelete(task.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Excluir</button>
                                            <button onClick={() => handleDone(task.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Concluir</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-8">
                    <TaskForm onTaskCreated={fetchTasks} />
                </div>
            </div>
        </div>
    );
}

export default TaskList;