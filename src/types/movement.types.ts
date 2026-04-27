export type MovementType = 'entrada' | 'salida';

export interface CreateMovementInput {
  productId: string;
  type: MovementType;
  quantity: number;
  unitPrice: number;
  notes?: string;
}