import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
console.log(process.env.PORT);
import express from 'express'
import User from './models/user.js'
import Cart from './models/cart.js'
import Product from './models/product.js'
import Category from './models/category.js'
import CartItem from './models/cartItem.js';
import sequelize from './utils/database.js';
import bodyParser from 'body-parser';
import httpStatusText from './utils/httpStatusText.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
app.use(cors());

// parsing application/json 
app.use(bodyParser.json());
//parsing application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes);


app.use((req, res, next) => {
    console.log(req.url);
    res.status(404).json({ stats: httpStatusText.ERROR, data: 'Invalid URL' })
})

// global error handling middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.status || httpStatusText.ERROR,
        message: err.message || 'Internal Server Error',
        code: err.statusCode
    })
})


User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });


Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Product, { as: 'AddedProducts', foreignKey: 'userId', onDelete: 'CASCADE' });
Product.belongsTo(User, { as: 'AddedByUser', foreignKey: 'userId' });

//sequelize.sync({ force: true })

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`listening on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err)
    })