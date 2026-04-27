// models/User.model.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'bodeguero' | 'consultor' | 'user';
  createdBy?: Schema.Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
  // id virtual estará disponible automáticamente
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'bodeguero', 'consultor', 'user'], default: 'user' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { 
  timestamps: true,
  // Importante: Para que los virtuals se incluyan en los resultados
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Agregar virtual 'id' que devuelve _id como string
userSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Middleware para hashear password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar password
userSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default model<IUser>('User', userSchema);