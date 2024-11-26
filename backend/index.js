import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import todoRoutes from './src/routes/todo.route.js';
import authRoutes from './src/routes/auth.route.js';  // Import des routes d'authentification
import User from './src/models/user.model.js'; // Import du modèle User

const app = express();
const port = 3001;

// Middleware pour analyser le JSON
app.use(express.json());

// Middleware pour activer CORS
app.use(cors());

// Utilisation des routes
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes); // Utilisation des routes d'authentification

// Synchronisation des modèles avec la base de données
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized.');
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error('Erreur attrapée par le middleware global :', err);
    // Vérification si l'erreur a un message, sinon envoie une erreur générique
    const message = err.message || 'Erreur interne du serveur.';
    const status = err.status || 500;
    res.status(status).json({ message });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
