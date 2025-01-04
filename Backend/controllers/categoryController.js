import catchAsync from '../middleware/catchAsync.js';
import AppError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
import Category from "../models/category.js";


const addCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        const err = new AppError('Name is required', httpStatusText.FAIL, 400);
        next(err);
    }

    const category = await Category.create({ name });
    res.status(201).json({ status: httpStatusText.SUCCESS, data: category });
});

const getCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: categories });
});

const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;


    const category = await Category.findByPk(id);

    if (!category) {
        const err = new AppError('Category not found', httpStatusText.FAIL, 404);
        next(err);
    }

    category.name = name || category.name;
    await category.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: category });

});

const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
        const err = new AppError('Category not found', httpStatusText.FAIL, 404);
        next(err);
    }

    await category.destroy();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

});


export {
    addCategory,
    getCategories,
    deleteCategory,
    updateCategory

}