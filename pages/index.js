import { useState, useEffect } from "react";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("/api/tasks");
                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []); // Effectuer la requête une seule fois après le premier rendu

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

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/task/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            // Si la suppression réussit, mettez à jour l'état des tâches pour exclure la tâche supprimée.
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche", error);
        }
    };

    const toggleCompletion = (id) => {
        const newTasks = tasks.map((task) => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(newTasks);
    };

    return (
        <div>
            <h1>Ma Liste de Tâches</h1>
            <div id="addSection">
                <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
                <button className="buttonAdd" onClick={addTask}>
                    Ajouter Tâche
                </button>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                        {task.title}
                        <div id="listButtons">
                            <button onClick={() => toggleCompletion(task._id)}>
                                {task.completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
                            </button>
                            <button onClick={() => deleteTask(task._id)} className="buttonSupp">
                                {"Supprimer"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
