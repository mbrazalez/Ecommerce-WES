import mongoose, { Schema, Types } from 'mongoose';

export interface Product {
  _id?: Types.ObjectId;
  name: string;
  brand: string;
  size: string;
  color: string;
  img: string;
  price: number;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  img: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);