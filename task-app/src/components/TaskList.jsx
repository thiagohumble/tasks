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
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-sky-500 text-center">Task List</h1>
                
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Criado em</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-700 divide-y divide-gray-600">
                            {tasks.map((task, index) => (
                                <tr key={task.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{task.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingTaskId === task.id ? (
                                            <input 
                                                type="text" 
                                                value={editedTitle} 
                                                onChange={(e) => setEditedTitle(e.target.value)} 
                                                className="bg-gray-700 text-white p-2 w-full rounded border border-gray-600 focus:border-sky-500 focus:ring-sky-500"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-300">{task.title}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingTaskId === task.id ? (
                                            <textarea 
                                                value={editedDescription} 
                                                onChange={(e) => setEditedDescription(e.target.value)} 
                                                className="bg-gray-700 text-white p-2 w-full rounded border border-gray-600 focus:border-sky-500 focus:ring-sky-500"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-300">{task.description}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingTaskId === task.id ? (
                                            <label className="inline-flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={editedDone} 
                                                    onChange={(e) => setEditedDone(e.target.checked)} 
                                                    className="form-checkbox h-5 w-5 text-sky-600 rounded focus:ring-sky-500 border-gray-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-300">Concluído</span>
                                            </label>
                                        ) : (
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.done ? 'bg-green-500 text-green-100' : 'bg-yellow-500 text-yellow-100'}`}>
                                                {task.done ? 'Concluída' : 'Pendente'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{task.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {editingTaskId === task.id ? (
                                            <button 
                                                onClick={() => handleSave(task.id)} 
                                                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-1 px-3 rounded mr-2 transition duration-150 ease-in-out"
                                            >
                                                Salvar
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(task)} 
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(task.id)} 
                                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out"
                                                >
                                                    Excluir
                                                </button>
                                                <button 
                                                    onClick={() => handleDone(task.id)} 
                                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out"
                                                >
                                                    Concluir
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    <TaskForm onTaskCreated={fetchTasks} />
                </div>
            </div>
        </div>
    );
}

export default TaskList;