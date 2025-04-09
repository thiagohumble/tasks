import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import LoginForm from './LoginForm.jsx';
import Logo from '../assets/Logo.jsx';
import RegisterForm from './RegisterForm';
import { jwtDecode } from "jwt-decode";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDone, setEditedDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiMessage, setApiMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(true);
    const [statusLoading, setStatusLoading] = useState('Carregando...');
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [showRegister, setShowRegister] = useState(false);
    

    useEffect(() => {
        setTimeout(()=>{
            setStatusLoading('Servidor está com inatividade, que pode atrasar as solicitações de até 50seg. Por favor aguarde!');
        },10000)

        fetchTasks();

        const checkTokenExpiration = () => {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const decoded = jwtDecode(token); // Você precisará instalar jwt-decode
              if (decoded.exp * 1000 < Date.now()) {
                // Token expirado - remove do localStorage
                localStorage.removeItem('token');
                setToken(null);
              }
            } catch (error) {
              console.error('Erro ao decodificar token:', error);
              localStorage.removeItem('token');
              setToken(null);
            }
          }
        };

        // Verifica ao carregar a página
        checkTokenExpiration();

        // Configura um intervalo para verificar periodicamente (opcional)
        const interval = setInterval(checkTokenExpiration, 60000); // Verifica a cada minuto

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar

    }, []);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token' , newToken);
    }

    const handleRegister = () => {
        setShowRegister(false);
    };

//listar tarefas
    const fetchTasks = () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      axios.get('http://127.0.0.1:3001/tasks', { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        if (error.response?.status === 401) {
          // Token inválido/expirado - faz logout
          localStorage.removeItem('token');
          setToken(null);
        }
        console.error('Erro ao buscar tasks:', error);
      })
      .finally(() => setLoading(false));
    };


    const handleEdit = (task) => {
        setEditingTaskId(task.id);
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setEditedDone(task.done);
    };

    const handleSave = (id) => {
        axios.put(`http://127.0.0.1:3001/tasks/${id}`, {
            title: editedTitle,
            description: editedDescription,
            done: editedDone
        }, { headers: { Authorization: `Bearer ${token}`} })
            .then(response => {
                setEditingTaskId(null);
                fetchTasks();
                setApiMessage(response.data.message + ` - ID: ${id}`  || 'Tarefa salva com sucesso.');
            })
            .catch(error => {
                console.error(error);
                setApiMessage(error.response?.data?.error || 'Erro ao salvar tarefa.');
            }); 
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:3001/tasks/${id}`, { headers: { Authorization: `Bearer ${token}`} })
            .then(response => {
                setEditingTaskId(null);
                fetchTasks();
                setApiMessage(response.data.message + ` - ID: ${id}` || 'Deletado')
            })
            .catch(error => {
                console.error(error);
                setApiMessage(error.response?.data?.error || 'Erro ao Excluir.');
            });
    };

    const handleDone = (id) => {
        axios.patch(`http://127.0.0.1:3001/tasks/${id}/done`, null, { headers: { Authorization: `Bearer ${token}`} })
            .then(response => {
                setEditingTaskId(null);
                fetchTasks();
                setApiMessage(response.data.message + ` - ID: ${id}` || 'Tarefa Concluida')
            })
            .catch(error => console.error(error));
    };

    const handleTaskCreated = (newTask) => {
        fetchTasks();
    };

    const taskForm = () => {
        if(token) {
            return (
                <div className="my-12">
                    <TaskForm onTaskCreated={handleTaskCreated} />
                </div>
            )
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-sky-500 text-center">
                    <div className="flex justify-center mb-8">
                        <Logo size={68} withText={true}  sizeText={'text-6xl'}/>
                    </div>
                </h1>

                {!token ? (
                    <div>
                        {showRegister ? (
                            <RegisterForm onRegister={handleRegister} />
                        ) : (
                            <LoginForm onLogin={handleLogin} />
                        )}
                        <button onClick={() => setShowRegister(!showRegister)} className="mt-4 cursor-pointer text-sky-500 hover:text-sky-400">
                            {showRegister ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Registre-se'}
                        </button>
                    </div>
                ) : taskForm()}


                {apiMessage && (
                    <div className={`${!token ? 'hidden' : 'block'} my-5 bg-gray-200 p-4 rounded-md transition duration-700 text-black ${isMessageVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {apiMessage}
                    </div>
                )}

{/*Desktop*/}
                <div className="hidden md:block w-full overflow-x-auto rounded-lg shadow-lg">
                    {loading ? (
                        <p className="animate-bounce">
                            {statusLoading}
                        </p>
                        ) : (
                            <table className="w-full">
                                <thead className={`bg-gray-950 ${!token ? 'invisible' : 'visible:'}`}>
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
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out cursor-pointer"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(task.id)} 
                                                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out cursor-pointer"
                                                        >
                                                            Excluir
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDone(task.id)} 
                                                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-150 ease-in-out cursor-pointer"
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
                        )
                    }

                </div>

{/*Mobile*/}
                {
                    loading ? (

                        <p className="md:hidden animate-bounce">{statusLoading}</p>
                        ) : (

                        <div className="md:hidden space-y-4">
                            {tasks.map((task) => (

                                <div key={task.id} className="bg-gray-800 rounded-lg shadow p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-sky-400">{task.title}</h3>
                                            <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.done ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                            {task.done ? 'Concluída' : 'Pendente'}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-sm text-gray-400">
                                        <p>ID: {task.id}</p>
                                        <p>Criado em: {task.createdAt}</p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {editingTaskId === task.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editedTitle}
                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                    className="bg-gray-700 text-white p-2 w-full rounded border border-gray-600 mb-2"
                                                    placeholder="Título"
                                                />
                                                <textarea
                                                    value={editedDescription}
                                                    onChange={(e) => setEditedDescription(e.target.value)}
                                                    className="bg-gray-700 text-white p-2 w-full rounded border border-gray-600 mb-2"
                                                    placeholder="Descrição"
                                                    rows={3}
                                                />
                                                <label className="flex items-center w-full mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editedDone}
                                                        onChange={(e) => setEditedDone(e.target.checked)}
                                                        className="form-checkbox h-5 w-5 text-sky-600 rounded mr-2"
                                                    />
                                                    <span className="text-sm">Concluído</span>
                                                </label>
                                                <button
                                                    onClick={() => handleSave(task.id)}
                                                    className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded flex-1"
                                                >
                                                    Salvar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(task)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex-1"
                                                >
                                                    Excluir
                                                </button>
                                                <button
                                                    onClick={() => handleDone(task.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex-1"
                                                >
                                                    Concluir
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )
                }

            </div>
        </div>
    );
}

export default TaskList;