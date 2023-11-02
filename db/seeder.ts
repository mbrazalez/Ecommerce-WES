import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders, { Order } from '@/models/Order';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Element Skateboard Starwars',
    brand: 'Element',
    size: '8.0 inches',
    color: 'black',
    price: 39.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/g/tgl255-tabla-skate-completa-globe-g1-digital-nurture-machine-made-man-8.0.jpg',
    description: 'The Elemental Skateboard made in Spain with the best materials. The best skateboard for beginners and advanced skaters. 100% recommended by the best skaters in the world. It has a size of 8.0 inches, ideal for all types of skaters. It is made of the best materials, with a very resistant wood and a very good grip. It also include the best griptape in the world.',
  },
  {
    name: 'Nomad Skateboard',
    brand: 'Nomad',
    size: '8.25 inches',
    color: 'green',
    price: 39.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/image/800x/602f0fa2c1f0d1ba5e241f914e856ff9/t/e/ten131-tabla-skate-enjoi-barletta-body-slam-r7-8.0.jpg',
    description:'The Nomad Skateboard is the nº1 skateboard in the world. It is made of the best materials, with a very resistant wood and a very good grip. The best skateboard for beginners and advanced skaters. 100% recommended by the best skaters in the world. It has a size of 8.25 inches, ideal for all types of skaters. It is made of the best materials, with a very resistant wood and a very good grip.'
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();

  const insertedProducts = await Products.insertMany(products);

  const orders: Order[] = [
    {
      orderItems: [
        {
          product: insertedProducts[0]._id,
          qty: 2,
          price: insertedProducts[0].price,
        }
      ],
      date: new Date(Date.now()),
      address: 'C/Felipe II, 2, 02600, Villarrobledo, Albacete',
      cardHolder: 'John Doe',
      cardNumber: '1234567890123456',
    },    
  ];

  const insertedOrders = await Orders.insertMany(orders);

  const password = await bcrypt.hash('1234', 10);

  const user: User = {
    email: 'johndoe@example.com',
    password: password,
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [
      insertedOrders[0]._id,
    ],
  };
  const user2: User = {
    email: 'bornidoe@example.com',
    password: password,
    name: 'Borni',
    surname: 'Doe',
    address: '2 Felipe II, 02600 Villarrobledo, Spain',
    birthdate: new Date('2002-04-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [
      insertedOrders[0]._id,
    ],
  };

  const res = await Users.create(user);
  const res2 = await Users.create(user2);
  console.log(JSON.stringify(res, null, 3));

  await conn.disconnect();
}

seed().catch(console.error);