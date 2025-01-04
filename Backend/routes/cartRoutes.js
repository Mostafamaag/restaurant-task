import express from 'express';
import { addCartItem, deleteCartItem, getCart } from '../controllers/cartController.js';
import allowedTo from '../middleware/allowedTo.js';
import verifyToken from '../middleware/verifyToken.js';
import Role from '../utils/userRoles.js';
const router = express.Router();

// Cart routes
router.use(verifyToken);
router.post('/add-item', allowedTo(Role.CUSTOMER), addCartItem); 
router.delete('/remove-item/:cartItemId', allowedTo(Role.CUSTOMER), deleteCartItem); 
router.get('/', allowedTo(Role.CUSTOMER), getCart); 

export default router;
