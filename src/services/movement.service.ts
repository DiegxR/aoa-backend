import Product from '../models/Product.model';
import Movement from '../models/Movement.model';
import Kardex from '../models/Kardex.model';
import { CreateMovementInput } from '../types/movement.types';
import mongoose from 'mongoose';

export const registerMovement = async (input: CreateMovementInput, userId: string) => {
  // Eliminamos completamente el uso de sesiones/transacciones para evitar el error de Replica Set
  try {
    const { productId, type, quantity, unitPrice, notes } = input;

    // 1. Buscar el producto
    const product = await Product.findById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const stockBefore = product.stock;
    let stockAfter = stockBefore;

    // 2. Actualizar stock del producto
    if (type === 'entrada') {
      stockAfter += quantity;
    } else if (type === 'salida') {
      if (stockBefore < quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }
      stockAfter -= quantity;
    }

    product.stock = stockAfter;
    await product.save();

    // 3. Crear el Movimiento
    const totalValue = quantity * unitPrice;
    const movement = await Movement.create({
      product: productId,
      type,
      quantity,
      unitPrice,
      totalValue,
      stockBefore,
      stockAfter,
      notes,
      registeredBy: userId
    });

    // 4. Crear el registro en Kardex
    await Kardex.create({
      product: productId,
      movement: movement._id,
      type,
      quantity,
      unitPrice,
      totalValue,
      stockBefore,
      stockAfter,
      date: new Date()
    });
    
    // Devolver el movimiento poblado
    return movement.populate('product registeredBy');

  } catch (error) {
    console.error('Error en registerMovement:', error);
    throw error;
  }
};
