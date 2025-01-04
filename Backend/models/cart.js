import sequelize from '../utils/database.js';
import { Sequelize } from 'sequelize';


const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
});

export default Cart;



