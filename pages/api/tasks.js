// pages/api/task.js
import dbConnect from '../../lib/mongodb';
import Task from '../../models/Task';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const task = new Task(req.body); // Crée une nouvelle instance de modèle Task avec les données de req.body
            await task.save(); // Enregistre la tâche dans la base de données
            res.status(201).json(task); // Renvoie la tâche sauvegardée avec un statut 201 (Created)
        } catch (error) {
            res.status(400).json({ success: false, error: error.message }); // Gère les erreurs potentielles
        }
    } else {
        // Gère d'autres méthodes HTTP ou renvoie une réponse 405 Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
