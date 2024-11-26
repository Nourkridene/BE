import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

// Modèle Todo
const Todo = sequelize.define('Todo', {
    task: {
        type: DataTypes.STRING,
        allowNull: false, // Champ obligatoire
    },
    category: {
        type: DataTypes.STRING,
    },
    deadline: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'à faire', // Valeur par défaut
    },
    assignedTo: {
        type: DataTypes.INTEGER,
    },
});

export default Todo;
