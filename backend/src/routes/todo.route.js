import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll(); // Récupérer tous les todos
        res.status(200).json(todos); // Répondre avec les todos trouvés
    } catch (error) {
        console.error('Erreur lors de la récupération des todos :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Route pour créer un nouveau todo
router.post('/', async (req, res) => {
    try {
        // Log pour afficher les données reçues
        console.log('Données reçues pour création :', req.body);

        const { task, category, deadline, status, assignedTo } = req.body;

        // Validation des champs obligatoires
        if (!task || !assignedTo) {
            return res.status(400).json({ message: 'La tâche et l\'utilisateur assigné sont requis.' });
        }

        // Création du todo
        const todo = await Todo.create({
            task,
            category,
            deadline,
            status: status || 'à faire', // Par défaut, le statut est "à faire"
            assignedTo,
        });

        // Répondre avec le todo créé
        res.status(201).json(todo);
    } catch (error) {
        console.error('Erreur lors de la création du todo :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});

// Route pour mettre à jour un todo (PUT /todos/:id)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task, category, deadline, status, assignedTo } = req.body;

        // Vérifier si le todo existe
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo non trouvé.' });
        }

        // Mettre à jour le todo
        await todo.update({
            task,
            category,
            deadline,
            status,
            assignedTo,
        });

        res.status(200).json(todo); // Répondre avec le todo mis à jour
    } catch (error) {
        console.error('Erreur lors de la mise à jour du todo :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const todos = await Todo.findAll({ where: { assignedTo: userId } });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
    }
});

// Route pour supprimer un todo (DELETE /todos/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le todo existe
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo non trouvé.' });
        }

        // Supprimer le todo
        await todo.destroy();

        res.status(200).json({ message: 'Todo supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du todo :', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});


export default router;
