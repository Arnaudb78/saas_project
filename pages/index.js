import { useState, useEffect } from "react";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");

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
    }, []);

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
            setNewTaskText("");
        } catch (error) {
            console.error("Erreur lors de la création de la tâche", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks?id=${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche", error);
        }
    };

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditingText(task.title);
    };

    const handleEditChange = (e) => {
        setEditingText(e.target.value);
    };

    const saveEdit = async () => {
        try {
            // Ici, vous devriez envoyer la mise à jour à votre API
            const response = await fetch(`/api/tasks?id=${editingTaskId}`, {
                method: "PUT", // Supposant que votre API utilise PUT pour les mises à jour
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editingText }),
            });

            if (!response.ok) {
                throw new Error(`Échec de la requête : ${response.status}`);
            }

            const updatedTask = await response.json();
            const updatedTasks = tasks.map((task) => (task._id === editingTaskId ? updatedTask : task));
            setTasks(updatedTasks);
            setEditingTaskId(null); // Quitter le mode édition
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la tâche", error);
        }
    };

    const toggleCompletion = (_id) => {
        const newTasks = tasks.map((task) => {
            if (task._id === _id) {
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
                    <li key={task._id}>
                        {editingTaskId === task._id ? (
                            <>
                                <input type="text" value={editingText} onChange={handleEditChange} />
                                <button onClick={saveEdit}>Sauvegarder</button>
                            </>
                        ) : (
                            <>
                                <p className="taskTitle" style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                                    {task.title}
                                </p>
                                <div id="listButtons">
                                    <button onClick={() => startEditing(task)}>{"Modifier"}</button>
                                    <button
                                        onClick={() => toggleCompletion(task._id)}
                                        style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                                        {task.completed ? "Marquer comme non complétée" : "Marquer comme complétée"}
                                    </button>
                                    <button onClick={() => deleteTask(task._id)} className="buttonSupp">
                                        {"Supprimer"}
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
