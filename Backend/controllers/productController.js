import Product from '../models/product.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatusText from '../utils/httpStatusText.js';
import Role from '../utils/userRoles.js';
import AppError from '../utils/appError.js';
import Category from '../models/category.js'
import { Op } from 'sequelize';

const addProduct = catchAsync(async (req, res, next) => {

    const { name, price } = req.body;
    if (!name || !price) {
        const error = new AppError('Name and price are required', httpStatusText.FAIL, 400);
        return next(error);
    }

    const user = req.user;
    if (!user || (user.role !== Role.CUSTOMER && user.role !== Role.RESTAURANT)) {
        const error = new AppError('You are not authorized to add product', httpStatusText.FAIL, 403);
        return next(error);
    }
    const product = await Product.create({
        name,
        price,
        userId: user.id
    });

    res.status(201).json({ status: httpStatusText.SUCCESS, data: product });

});

const getProductsByUser = catchAsync(async (req, res, next) => {

    const user = req.user;
    console.log(user);
    if (!user || (user.role !== Role.CUSTOMER && user.role !== Role.RESTAURANT)) {
        const error = new AppError('You are not authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    const products = await Product.findAll({
        where: { userId: user.id },
    });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { products } });

});

const editProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { name, price } = req.body;
    console.log(name, req.user);

    const user = req.user;
    if (!user || (user.role !== Role.CUSTOMER && user.role !== Role.RESTAURANT)) {
        const error = new AppError('You are not authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    const product = await Product.findOne({
        where: { id, userId: user.id }
    });

    if (!product) {
        const error = new AppError('Product not found'.httpStatusText.FAIL, 404);
        next(error);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    await product.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: product });


});

const deleteProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const user = req.user;
    if (!user || (user.role !== Role.CUSTOMER && user.role !== Role.RESTAURANT)) {
        const error = new AppError('You are not authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    const product = await Product.findOne({
        where: { id, userId: user.id }
    });

    if (!product) {
        const error = new AppError('Product not found'.httpStatusText.FAIL, 404);
        next(error);
    }

    await product.destroy();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

});


const getProductsByCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;


    const category = await Category.findByPk(categoryId);
    if (!category) {
        const err = new Error("Category not found", httpStatusText.FAIL, 404);
        next(err);
    }

    const products = await Product.findAll({
        where: { categoryId },
    });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: products });

});

const getProducts = catchAsync(async (req, res, next) => {
    console.log("getProducts");


    const products = await Product.findAll();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: products });

});


const getProductsByCategories = catchAsync(async (req, res, next) => {

    const { categories } = req.query;
    if (!categories) {
        const err = new Error("Categories are required", httpStatusText.FAIL, 400)
        return next(err);
    }
    console.log(categories)
    const categoryIds = categories.split(','); // Split the categories string into an array
    const products = await Product.findAll({
        where: {
            categoryId: {
                [Op.in]: categoryIds, // Use Op.in to filter by multiple categories
            },
        },
    });
    console.log(products);
    if (!products || products.length === 0) {
        return next(new Error("No products found for the given categories", httpStatusText.FAIL, 404));
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: products });
});

export {
    addProduct,
    getProducts,
    deleteProduct,
    editProduct,
    getProductsByCategory,
    getProductsByUser,
    getProductsByCategories
}