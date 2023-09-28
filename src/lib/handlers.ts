// This file contains the logic of the REST API endpoints
import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';

import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

export interface CreateUserResponse {
    _id: Types.ObjectId | string;
}

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

export interface UserResponse {
    email: string;
    name: string;
    surname: string;
    address: string;
    birthdate: Date;
}


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

export interface ProductsResponse { // This interface defines the shape of the response.
    products: Product[];
}

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

export interface ProductResponse {
    name: string;
    price: number;
    img: string;
}

export async function getProduct(productId: string): Promise<UserResponse | null> {
    await connect();

    const productProjection = {
        name: true,
        price: true,
        img: true,
    };

    const product = await Products.findById(productId, productProjection);

    if (product === null) {
        return null;
    }

    return product;
}

export interface CartItemsResponse {
    cartItems: User['cartItems'];
}

export async function getCartItems(userId: string): Promise<CartItemsResponse| null> {
    await connect();

    const userProjection = {
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

export async function addProductToCart(userId: string, productId: string, qty: number): Promise<CartItemsResponse | null> {
    await connect();

    const userProjection = {
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
    
    let exists = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].product == productId) {
            cart[i].qty = qty;
            exists = true;
        }
    }


    if (exists === false) {
        cart.push({
            product: productId,
            qty: qty,
        });
    }

    await Users.findByIdAndUpdate(userId, { cartItems: cart });

    return user.populate('cartItems.product', productProjection);
}

export async function deleteProductFromCart(userId: string, productId: string): Promise<CartItemsResponse | null>{
    await connect();

    const userProjection = {
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

    let exists = false;
    for(let i = 0; i < cart.length; i++) {
        if (cart[i].product == productId) {
            cart.splice(i, 1);
            exists = true;
        }
    }

    if (exists === false) {
        return null;
    }

    await Users.findByIdAndUpdate(userId, { cartItems: cart });

    return user.populate('cartItems.product', productProjection);
} 