import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  code: string;
  description?: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  category: string;
  image?: string;
  active: boolean;
}

const productSchema = new Schema<IProduct>({
  name:        { type: String, required: true, trim: true },
  code:        { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  stock:       { type: Number, required: true, default: 0, min: 0 },
  minStock:    { type: Number, default: 0 },
  unitPrice:   { type: Number, required: true, min: 0 },
  category:    { type: String, required: true },
  image:       { type: String },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

export default model<IProduct>('Product', productSchema);