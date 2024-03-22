import dbConnect from "../../lib/mongodb";
import Task from "../../models/Task";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            const deletedTask = await Task.findByIdAndDelete(id);
            if (!deletedTask) {
                res.status(404).json({ success: false, message: "Task not found" });
                return;
            }
            // Code pour gérer la suppression de la tâche...
            res.status(200).json({ success: true, message: "Task deleted successfully" });
        } catch (error) {
            // Code pour gérer les erreurs...
            res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === "PUT") {
        try {
            const { id } = req.query; // Assurez-vous de passer l'ID correctement dans la requête client
            const taskData = req.body;

            // Mettre à jour la tâche en utilisant son ID.
            // Assurez-vous que la structure de taskData correspond à votre modèle Task.
            const updatedTask = await Task.findByIdAndUpdate(id, taskData, { new: true });
            // L'option { new: true } garantit que le document renvoyé est après la mise à jour

            if (!updatedTask) {
                res.status(404).json({ success: false, message: "Task not found" });
                return;
            }

            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === "GET") {
        try {
            // Je veut sort en ascendant mais je n'ai pas de createdAt
            const tasks = await Task.find({}).sort({ _id: -1 });

            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === "POST") {
        try {
            const task = new Task(req.body);
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        // Gère d'autres méthodes HTTP ou renvoie une réponse 405 Method Not Allowed
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
