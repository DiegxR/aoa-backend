import { Schema, model, Document, Types } from 'mongoose';

export interface IKardex extends Document {
  product: Types.ObjectId;
  movement: Types.ObjectId;
  type: 'entrada' | 'salida';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  stockBefore: number;
  stockAfter: number;
  date: Date;
}

const kardexSchema = new Schema<IKardex>({
  product:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  movement:   { type: Schema.Types.ObjectId, ref: 'Movement', required: true },
  type:       { type: String, enum: ['entrada', 'salida'], required: true },
  quantity:   { type: Number, required: true },
  unitPrice:  { type: Number, required: true },
  totalValue: { type: Number, required: true },
  stockBefore:{ type: Number, required: true },
  stockAfter: { type: Number, required: true },
  date:       { type: Date, default: Date.now },
}, { timestamps: true });

export default model<IKardex>('Kardex', kardexSchema);