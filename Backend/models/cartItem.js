
import sequelize from '../utils/database.js';
import { Sequelize } from 'sequelize';


const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

});

export default CartItem;



