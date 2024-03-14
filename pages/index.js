import { useState } from "react";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");

    const addTask = async () => {
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: newTaskText, completed: false }),
            });

            if (!response.ok) {
                throw new Error(`Échec de la requête : ${response.status}`);
            }

            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setNewTaskText(""); // Efface le champ du formulaire après l'ajout de la tâche
        } catch (error) {
            console.error("Erreur lors de la création de la tâche", error);
        }
    };

    const handleInputChange = (event) => {
        setNewTaskText(event.target.value);
    };

    return (
        <div>
            <h1>Ma Liste de Tâches</h1>
            <div id="addSection">
                <input type="text" value={newTaskText} onChange={handleInputChange} placeholder="Nouvelle Tâche" />
                <button className="buttonAdd" onClick={addTask}>
                    Ajouter Tâche
                </button>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                        {task.title}
                        <div id="listButtons">
                            <button onClick={() => toggleCompletion(task.id)}>
                                {task.completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
                            </button>
                            <button onClick={() => deleteTask(task.id)} className="buttonSupp">
                                {"Supprimer"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
