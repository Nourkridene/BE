import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('à faire');
  const router = useRouter();

  // Vérification si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirige vers login si pas connecté
    }
  }, [router]);

  // Charger les todos pour l'utilisateur connecté
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur connecté
        const response = await axios.get(`http://localhost:3001/todos/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec le token
          },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        // Si l'authentification échoue, rediriger vers la page de login
        if (error.response?.status === 401) {
          router.push('/login');
        }
      }
    };

    fetchTodos();
  }, [router]);

  // Fonction pour gérer l'ajout d'un todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // ID utilisateur connecté
      await axios.post(
        'http://localhost:3001/todos',
        { 
          task, 
          category, 
          deadline, 
          status, 
          assignedTo: userId, // Attribue le todo à l'utilisateur connecté
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Authentification avec le token
          },
        }
      );

      // Recharger les todos après ajout
      const response = await axios.get(`http://localhost:3001/todos/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTodos(response.data);
      setTask('');
      setCategory('');
      setDeadline('');
      setStatus('à faire');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Erreur lors de l\'ajout du todo');
    }
  };

  // Fonction pour gérer le changement de statut d'une tâche
  const handleStatusChange = async (todoId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3001/todos/${todoId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTodos(todos.map((todo) => 
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };

  // Fonction pour gérer la suppression d'une tâche
  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Ma Todo List</h1>
      
      {/* Formulaire pour ajouter un todo */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Nom de la tâche"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Catégorie"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="à faire">À faire</option>
            <option value="en cours">En cours</option>
            <option value="complétée">Complétée</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Ajouter un todo
        </button>
      </form>

      {/* Liste des todos */}
      <div>
        {todos.length === 0 ? (
          <p>Aucun todo à afficher.</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className="p-2 border-b">
                <h3 className="font-bold">{todo.task}</h3>
                <p>Catégorie: {todo.category}</p>
                <p>Deadline: {new Date(todo.deadline).toLocaleString()}</p>
                <p>Status: {todo.status}</p>
                
                {/* Bouton pour changer le statut */}
                <button
                  onClick={() => handleStatusChange(todo.id, 'complétée')}
                  disabled={todo.status === 'complétée'}
                  className="bg-green-500 text-white p-2 rounded mt-2 mr-2"
                >
                  Marquer comme Complétée
                </button>

                {/* Bouton pour supprimer la tâche */}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white p-2 rounded mt-2"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
