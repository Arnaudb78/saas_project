import { useState } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskText, completed: false }),
      });

      if (!response.ok) {
        throw new Error(`Échec de la requête : ${response.status}`);
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskText(''); // Efface le champ du formulaire après l'ajout de la tâche

    } catch (error) {
      console.error('Erreur lors de la création de la tâche', error);
    }
  };

  const handleInputChange = (event) => {
    setNewTaskText(event.target.value);
  };

  return (
      <div>
        <h1>Ma Liste de Tâches</h1>
        <input
            type="text"
            value={newTaskText}
            onChange={handleInputChange}
            placeholder="Nouvelle Tâche"
        />
        <button onClick={addTask}>Ajouter Tâche</button>
        <ul>
          {tasks.map((task) => (
              <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </li>
          ))}
        </ul>
      </div>
  );
}
