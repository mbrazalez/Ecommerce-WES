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
    price: 69.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/g/tgl255-tabla-skate-completa-globe-g1-digital-nurture-machine-made-man-8.0.jpg',
    description: 'Unleash the force with the Element Skateboard Starwars edition. Crafted in Spain with top-notch materials, this skateboard is endorsed by world-class skaters. Ideal for both beginners and advanced skaters, it features a sleek black design, measures 8.0 inches, and is made from the finest, highly durable wood with an exceptional grip. Elevate your skateboarding experience with the included world-class griptape.'
  },
  {
    name: 'Enjoi Skateboard Barletta',
    brand: 'Enjoi Skateboards',
    size: '8.0 inches',
    color: 'green',
    price: 54.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/image/800x/602f0fa2c1f0d1ba5e241f914e856ff9/t/e/ten131-tabla-skate-enjoi-barletta-body-slam-r7-8.0.jpg',
    description: 'Experience the thrill of skateboarding with the Enjoi Skateboard Barletta edition. Widely regarded as the number one skateboard globally, it boasts superior craftsmanship and is made from top-quality materials. This skateboard, with its vibrant green color, is perfect for riders of all levels. Featuring a size of 8.0 inches, it provides an optimal blend of stability and maneuverability. The deck is crafted from premium materials, ensuring durability and an excellent grip for every skate session.'
  },
  {
    name: 'Darkstar Skateboard Madballs',
    brand: 'Darkstar',
    size: '8.25 inches',
    color: 'orange',
    price: 39.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/d/tda214-tabla-skate-darkstar-madballs-icon-hyb-orange-8.0.jpeg',
    description: 'Unleash your passion for skateboarding with the Darkstar Skateboard Madballs edition. Renowned for its exceptional quality, this skateboard is the top choice for both novice and advanced skaters. The vibrant orange color adds a bold touch to your ride. With a size of 8.25 inches, it offers versatility for various skate styles. Crafted from premium materials, this skateboard ensures durability and provides an outstanding grip for an unparalleled skateboarding experience.'
  },
  {
    name: 'Cruzade Skateboard Army',
    brand: 'Cruzade Skateboards',
    size: '8.75 inches',
    color: 'yellow',
    price: 49.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/c/tcrz029-tabla-skate-cruzade-army-label-yellow-8.875.jpg',
    description: 'Join the ranks of elite skateboarders with the Cruzade Skateboard Army edition. Crafted for excellence by Cruzade Skateboards, this skateboard is the epitome of quality and style. The striking yellow color adds a bold statement to your skate sessions. With a size of 8.75 inches, it provides stability and control, making it an ideal choice for skateboarders of all levels. The deck is made from top-tier materials, ensuring durability and a superior grip for an unbeatable skateboarding experience.'
  },
  {
    name: 'DGK Skateboard Tsunami',
    brand: 'DGK',
    size: '8.25 inches',
    color: 'green',
    price: 39.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/d/tdgk037-tabla-skate-dgk-tsunami.jpg',
    description: 'Experience the power and style of the DGK Skateboard Tsunami edition. DGK, known for its cutting-edge designs, brings you a skateboard that stands out on the streets. With a sleek green color, this skateboard is a favorite among riders. The 8.25-inch size strikes a perfect balance between stability and maneuverability, making it suitable for various skate styles. Crafted from high-quality materials, the deck ensures durability and an excellent grip for an extraordinary skateboarding adventure.'
  },
  {
    name: 'Toy Machine Skateboard Demon-God',
    brand: 'Toy Machine',
    size: '8.25 inches',
    color: 'green',
    price: 54.95,
    img: 'https://cdn.skatespain.com/media/catalog/product/cache/1/small_image/1000x/602f0fa2c1f0d1ba5e241f914e856ff9/t/t/ttm009-tabla-skate-toy-machine-bury-the-hatchet_1.jpg',
    description: 'Embark on a legendary skateboarding journey with the Toy Machine Skateboard Demon-God edition. Hailing from the iconic brand, Toy Machine, this skateboard is a symbol of style and quality. Meticulously crafted in Mexico with Canadian maple, it delivers unmatched performance. The striking green color adds a touch of rebellion to your skate sessions. Perfect for riders who appreciate the combination of artistry and functionality in their skateboard. Unleash the power of the Demon-God!'
  }
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