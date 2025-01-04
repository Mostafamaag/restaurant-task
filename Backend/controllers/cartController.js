import catchAsync from '../middleware/catchAsync.js';
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';
import AppError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
import Role from '../utils/userRoles.js';

const addCartItem = catchAsync(async (req, res, next) => {

    const user = req.user;

    if (!user || user.role !== Role.CUSTOMER) {
        const err = new AppError('Forbidden: Only customers can add items to the cart', httpStatusText.FAIL, 403);
        next(err)
    }

    const { productId, quantity } = req.body;

    // check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
        const err = new AppError('Product not found', httpStatusText.FAIL, 400);
        next(err)
    }

    // find or create the customer's cart
    let cart = await Cart.findOne({ where: { userId: user.id } });
    if (!cart) {
        cart = await Cart.create({ userId: user.id });
    }

    // check if the product in the cart
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
        cartItem.quantity += quantity || 1;
        await cartItem.save();
    } else {
        cartItem = await CartItem.create({ cartId: cart.id, productId, quantity: quantity || 1 });
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { cartItem } });

});

const deleteCartItem = catchAsync(async (req, res, next) => {


    const user = req.user;

    if (!user || user.role !== Role.CUSTOMER) {
        const err = new AppError('Forbidden: Only customers can delete items from the cart', httpStatusText.FAIL, 403);
        next(err)
    }

    const { cartItemId } = req.params;

    // find the cart item
    const cartItem = await CartItem.findByPk(cartItemId, {
        include: [{ model: Cart, where: { userId: user.id } }],
    });

    if (!cartItem) {
        const err = new AppError('Cart item not found or not in your cart', httpStatusText.FAIL, 404);
        next(err)
    }

    // delete 
    await cartItem.destroy();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

const getCart = catchAsync(async (req, res, next) => {

    const user = req.user;

    if (!user || user.role !== Role.CUSTOMER) {
        const err = new AppError('Forbidden: Only customers can delete items from the cart', httpStatusText.FAIL, 403);
        next(err)
    }

    // Find the customer's cart and include cart items with product details
    const cart = await Cart.findOne({
        where: { userId: user.id },
        include: [
            {
                model: CartItem,
                include: [Product],
            },
        ],
    });

    if (!cart) {
        const err = new AppError('Cart not found', httpStatusText.FAIL, 403);
        next(err)
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: cart });


});


export {
    addCartItem,
    deleteCartItem,
    getCart
}