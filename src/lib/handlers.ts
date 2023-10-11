// This file contains the logic of the REST API endpoints
import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';

import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

import Orders, { Order } from '@/models/Order';

// * INTERFACE OF: POST /api/users

export interface CreateUserResponse {
    _id: Types.ObjectId | string;
}

// * FUNCTION: POST /api/users

export async function createUser(user: {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
}): Promise <CreateUserResponse | null> {
    await connect();

    const prevUser = await Users.find({ email: user.email });

    if (prevUser.length !== 0) {
        return null;
    }

    const doc: User = {
        ...user,
        birthdate: new Date(user.birthdate),
        cartItems: [],
        orders: [],
    };

    const newUser = await Users.create(doc);

    return {
        _id: newUser._id,
    };
};




// *******************************************
// *******************************************



// * INTERFACE OF: GET /api/users/[userId]

export interface UserResponse {
    email: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
}

// * FUNCTION: GET /api/users/[userId]

export async function getUser(userId: string): Promise<UserResponse | null> {
    await connect();

    const userProjection = {
        email: true,
        name: true,
        surname: true,
        address: true,
        birthdate: true,
    };
    const user = await Users.findById(userId, userProjection);

    if (user === null) {
        return null;
    }

    return user;
}




// *******************************************
// *******************************************



// * INTERFACE OF: GET /api/products

export interface ProductsResponse { // This interface defines the shape of the response.
    products: Product[];
}

// * FUNCTION: GET /api/products

export async function getProducts(): Promise<ProductsResponse> {// returns a promise of type ProductsResponse.
    await connect();

    const productProjection = { //atributos que quiero que me devuelva
        name: true,
        price: true,
        img: true,
    };
    const products = await Products.find({}, productProjection);
    return {
        products: products,
    };
} // now we can use this function in our route.ts file






// *******************************************
// *******************************************


//* INTERFACE OF: GET /api/products/[productId]

export interface ProductResponse {
    name: string;
    price: number;
    img: string;
    description: string;
}

// * FUNCTI0N: GET /api/products/[productId]

export async function getProduct(productId: string): Promise<UserResponse | null> {
    await connect();

    const productProjection = {
        name: true,
        price: true,
        img: true,
        description: true,
    };

    const product = await Products.findById(productId, productProjection);

    if (product === null) {
        return null;
    }

    return product;
}




// *******************************************
// *******************************************

// * INTERFACE OF: GET /api/users/[userId]/cart
//* INTERFACE OF PUT: /api/users/[userId]/cart[productId]
// * INTERFACE OF DELETE: /api/users/[userId]/cart[productId]

export interface CartItemsResponse {
    cartItems: Types.ObjectId[];
}

// * FUNCTION: GET /api/users/[userId]/cart

export async function getCartItems(userId: string): Promise<CartItemsResponse| null> {
    await connect();

    const userProjection = {
        _id: false,
        cartItems: true,
    };

    const productProjection = {
        name: true,
        price: true,
    }

    const user = await Users.findById(userId, userProjection);

    if (user === null) {
        return null;
    }

    return user.populate('cartItems.product', productProjection);
}


// *******************************************
// *******************************************



// * FUNCTION: PUT /api/users/[userId]/cart/[productId]

export async function addProductToCart(userId: string, productId: string, qty: number): Promise<CartItemsResponse | null> {
    await connect();

    const userProjection = {
        _id: false,
        cartItems: true,
    };

    const productProjection = {
        name: true,
        price: true,
    }

    const user = await Users.findById(userId, userProjection);//.populate('cartItems.product', productProjection);
    if (user === null) {
        return null;
    }

    const product = await Products.findById(productId);
    if (product === null) {
        return null;
    }

    const cart = user.cartItems;

    const productInCart = cart.find((item: { product: string }) => item.product == productId);

    if (productInCart) {
        productInCart.qty = qty;
    } else {
        cart.push({
            product: productId,
            qty: qty,
        });
    }

    await Users.findByIdAndUpdate(userId, { cartItems: cart });

    return user.populate('cartItems.product', productProjection);
}

// *******************************************
// *******************************************


// * FUNCTION: DELETE /api/users/[userId]/cart/[productId]

export async function deleteProductFromCart(userId: string, productId: string): Promise<CartItemsResponse | null>{
    await connect();

    const userProjection = {
        _id: false,
        cartItems: true,
    };

    const productProjection = {
        name: true,
        price: true,
    };

    const user = await Users.findById(userId, userProjection);
    if (user === null) {
        return null;
    }

    const product = await Products.findById(productId);
    if (product === null) {
        return null;
    }

    const cart = user.cartItems;

    /*let exists = false;
    for(let i = 0; i < cart.length; i++) {
        if (cart[i].product == productId) {
            cart.splice(i, 1);
            exists = true;
        }
    }

    if (exists === false) {
        return null;
    }*/

    const productInCart = cart.find((item: { product: string }) => item.product == productId);

    if (productInCart) {
        const index = cart.indexOf(productInCart);
        cart.splice(index, 1);
    } else {
        return null;
    }

    await Users.findByIdAndUpdate(userId, { cartItems: cart });

    return user.populate('cartItems.product', productProjection);
}


// *******************************************
// *******************************************

// * INTERFACE OF: GET /api/users/[userId]/orders

export interface OrdersResponse {
    orders: User['orders'];
}

// * FUNCTION: GET /api/users/[userId]/orders

export async function getOrders(userId: string): Promise<OrdersResponse | null> {
    await connect();

    const userProjection = {
        _id: false,
        orders: true,
    };
    
    const orderProjection = {
        _id: false,
        date: true,
        address: true,
        cardHolder: true,
        cardNumber: true,
    };

    const user = await Users.findById(userId, userProjection);

    if (user === null){
        return null;
    }

    return user.populate('orders', orderProjection);
}


// *******************************************
// *******************************************

export async function createOrder(userId: string, address: string, cardHolder: string, cardNumber: string): Promise<{_id: string;} | null>{
    await connect();

    const user = await Users.findById(userId).populate('cartItems.product');

    if (user === null) {
        return null;
    }

    const cart = user.cartItems;

    if (cart.length === 0) {
        return null;
    }

    const orderItems = user.cartItems.map((item: any) =>{
        return{
            product: item.product,
            qty: item.qty,
            price: item.product.price,
        }
    });

    const order: Order = {
        date: new Date(),
        address: address,
        cardHolder: cardHolder,
        cardNumber: cardNumber,
        orderItems: orderItems,
    };

    const newOrder = await Orders.create(order);
    const orderId = newOrder._id;

    user.cartItems = [];
    user.orders.push(orderId);

    await user.save();

    return {
        _id: orderId,
    };
}