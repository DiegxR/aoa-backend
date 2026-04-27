import { Schema, model, Document, Types } from 'mongoose';
import { MovementType } from '../types/movement.types';

export interface IMovement extends Document {
  product: Types.ObjectId;
  type: MovementType;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  stockBefore: number;
  stockAfter: number;
  notes?: string;
  registeredBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const movementSchema = new Schema<IMovement>({
  product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  type:         { type: String, enum: ['entrada', 'salida'], required: true },
  quantity:     { type: Number, required: true, min: 1 },
  unitPrice:    { type: Number, required: true, min: 0 },
  totalValue:   { type: Number, required: true },
  stockBefore:  { type: Number, required: true },
  stockAfter:   { type: Number, required: true },
  notes:        { type: String },
  registeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default model<IMovement>('Movement', movementSchema);