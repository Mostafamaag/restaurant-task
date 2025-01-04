import express from 'express';
import { addProduct, deleteProduct, editProduct, getProducts, getProductsByCategory, getProductsByUser, getProductsByCategories } from '../controllers/productController.js';

import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';
import Role from '../utils/userRoles.js';

const router = express.Router();


router.post('/', verifyToken, allowedTo(Role.RESTAURANT, Role.CAFE), addProduct);
router.get('/user', verifyToken, allowedTo(Role.RESTAURANT, Role.CAFE), getProductsByUser);
router.get('/category/categoryId', verifyToken, allowedTo(Role.RESTAURANT, Role.CAFE), getProductsByCategory);
router.get('/', getProducts);
router.put('/:id', verifyToken, allowedTo(Role.RESTAURANT, Role.CAFE), editProduct);
router.delete('/:id', verifyToken, allowedTo(Role.RESTAURANT, Role.CAFE), deleteProduct);
router.get('/categories', getProductsByCategories)

export default router;