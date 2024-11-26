import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // Pour s'assurer qu'il n'y a pas de doublons d'emails
        allowNull: false,
        validate: {
            isEmail: true, // Validation pour s'assurer que c'est bien un email valide
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default User;
