// This file contains the logic of the REST API endpoints
import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';

import Users, { User } from '@/models/User';
import { Types } from 'mongoose';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

import Orders, { Order } from '@/models/Order';

import bcrypt from 'bcrypt';

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

    const hash = await bcrypt.hash(user.password, 10);

    const doc: User = {
        ...user, // spread operator, which means that we are copying all the properties of the user object
        password: hash,
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



export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  name: string;
  brand: string;
  price: number;
  img: string;
  color: string;
  size: string;
}

/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/

// Logic for get the list of available products
export async function getProducts(): Promise<ProductsResponse> {
  await connect();

  const productProjection = {
    name: true,
    brand: true,
    color: true,
    price: true,
    img: true,
  };

  const products = await Products.find({}, productProjection);
  
  return {
    products: products,
  };
}

// Logic for get the a product with a given id
export async function getProduct(productId: string): Promise<ProductResponse | null> {
  await connect();

  const productProjection = {
    name: true,
    size: true,
    brand: true,
    color: true,
    price: true,
    img: true,
  };

  const product = await Products.findById(productId, productProjection);

  if (product === null) {
    return null;
  }

  return product;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Logic for cartItems endpoints
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Needed interfaces to define the response of the endpoints 

export interface CartItemsResponse {
  cartItems: User['cartItems'];
}

export interface UpdateCartItemResponse {
  cartItems: User['cartItems'];
  exists: boolean;
}


/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/

// Logic for get the items in the cart
export async function getCartItems(userId: string): Promise<CartItemsResponse | null> {
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

  return user.populate('cartItems.product',productProjection);
}

// Logic for update the cart
export async function updateCartItem(userId: string, productId: string, qty: number): Promise<UpdateCartItemResponse | null> {
  await connect();

  const userProjection = {
    _id: false,
    cartItems: true,
  };

  const user = await Users.findById(userId, userProjection);
  const product = await Products.findById(productId);

  if (user === null || product === null) {
    return null;
  }

  const existingCartItemIndex = user.cartItems.findIndex((item:any) => item.product.toString() === productId);
  
  let inCart = false;

  if (existingCartItemIndex !== -1) {
    user.cartItems[existingCartItemIndex].qty = qty;
    inCart = true;
  } else {
    user.cartItems.push({ product: new Types.ObjectId(productId), qty: qty });
  }

  await Users.findByIdAndUpdate(userId, { cartItems: user.cartItems });
  await user.populate('cartItems.product', { name: true, price: true });

  return {cartItems: user.cartItems , exists: inCart};
}


// Logic for delete a cartItem
export async function deleteCartItem(userId: string, productId: string): Promise<CartItemsResponse | null> {
  await connect();

  const userProjection = {
    _id: false,
    cartItems: true,
  };

  const user = await Users.findById(userId, userProjection);

  if (user === null) {
    return null;
  }

  const cartItems = user.cartItems;
  const existingCartItemIndex = user.cartItems.findIndex((item:any) => item.product.toString() === productId);
  
  if (existingCartItemIndex === -1) {
    return null;
  }  
  
  cartItems.splice(existingCartItemIndex, 1);

  await Users.findByIdAndUpdate(userId, { cartItems: cartItems });
  await user.populate('cartItems.product', { name: true, price: true })

  return user;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Logic for Orders endpoints
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Needed interfaces to define the response of the endpoints 

export interface OrdersResponse {
  orders: User['orders'];
}

export interface OrderResponse {
  _id?: Types.ObjectId;
    orderItems: {
        product: Types.ObjectId;
        qty: number;
        price: number;
    }[];
    date: Date;
    address: string;
    cardHolder: string;
    cardNumber: string;
}

/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/

// Logic for get all the orders of a user
export async function getOrders(userId: string): Promise<OrdersResponse | null> {
  await connect();

  const orderProjection = {
    _id: false,
    orders: true,
  };

  const orderShowProjection = {
    date: true,
    address: true,
    cardHolder: true,
    cardNumber: true,
  };

  const user = await Users.findById(userId, orderProjection);
  if (user === null || user.orders.length === 0) {
    return null;
  }

  return user.populate('orders', orderShowProjection);
}

// Logic for get the order of a user with a given an id 
export async function getOrder (userId:string, orderId:string): Promise<OrderResponse | null>{
  await connect();

  const userProjection = {
    _id: false,
    orders: true,
  };

  const user = await Users.findById(userId, userProjection);
  
  if (user === null) {
    return null;
  }

  const existingOrderIndex = user.orders.findIndex((item:any) => item.toString() === orderId);

  if (existingOrderIndex === -1) {
    return null;
  }

  const order = await Orders.findById(orderId, {__v: false});
  return order.populate('orderItems.product', {name: true});

}
  
//Logic for create a new order
export async function createOrder(userId: string, address:string, cardHolder: string, cardNumber: string): Promise<{ _id: string; } | null | 'empty'> {
  await connect();

  const user = await Users.findById(userId).populate('cartItems.product');
  if (user === null) {
    return null;
  }

  if (user.cartItems.length === 0) {
    return 'empty';
  }

  const orderItems = user.cartItems.map((item:any) => {
    return {
      product: item.product,
      qty: item.qty,
      price: item.product.price,
    };
  });

  const orderDoc: Order = {
    orderItems: orderItems,
    date: new Date(),
    address: address,
    cardHolder: cardHolder,
    cardNumber: cardNumber,
  };

  const newOrder = await Orders.create(orderDoc);
  const orderId = newOrder._id;

  user.cartItems = [];
  user.orders.push(orderId);

  await Users.findByIdAndUpdate(userId, { cartItems: user.cartItems, orders: user.orders });

  return  {
    _id: orderId,
  };
}