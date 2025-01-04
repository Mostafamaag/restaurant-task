import sequelize from '../utils/database.js';
import { Sequelize } from 'sequelize';


const Product = sequelize.define('product', {
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
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    // stock: {
    //     type: Sequelize.INTEGER,
    //     defaultValue: 0,
    // },
});

export default Product;



