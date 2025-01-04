import sequelize from '../utils/database.js';
import { Sequelize } from 'sequelize';


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    role: {
        type: Sequelize.ENUM('CAFE', 'RESTAURANT', 'CUSTOMER'),
        defaultValue: 'CUSTOMER',
        allowNull: false
    }
})

export default User;