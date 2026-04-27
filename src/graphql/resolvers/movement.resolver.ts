import { registerMovement } from '../../services/movement.service';
import { checkRole } from '../../utils/permissions';
import { logOperation } from '../../middlewares/logger.middleware';
import { GraphQLContext } from '../../types/context.types';
import { CreateMovementInput } from '../../types/movement.types';
import Movement from '../../models/Movement.model';
import Kardex from '../../models/Kardex.model';
import Product from '../../models/Product.model';
import { startOfDay, startOfWeek, startOfMonth, subMonths, format } from 'date-fns';

export const movementResolver = {
  Query: {
    movements: async (
      _: unknown, 
      { productId, type, userId, startDate, endDate }: { productId?: string; type?: string; userId?: string; startDate?: string; endDate?: string }, 
      context: GraphQLContext
    ) => {
      checkRole(context, ['admin', 'bodeguero', 'consultor', 'user'] as any);
      const filter: any = {};
      if (productId) filter.product = productId;
      if (type) filter.type = type;
      if (userId) filter.registeredBy = userId;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      return Movement.find(filter).populate('product registeredBy').sort({ createdAt: -1 });
    },
    kardex: async (_: unknown, { productId }: { productId?: string }, context: GraphQLContext) => {
      checkRole(context, ['admin', 'bodeguero', 'consultor', 'user'] as any);
      const filter = productId ? { product: productId } : {};
      return Kardex.find(filter).populate('product movement').sort({ date: -1 });
    },
    salesStats: async (_: unknown, __: unknown, context: GraphQLContext) => {
      checkRole(context, ['admin', 'consultor'] as any);
      const now = new Date();
      const dayStart = startOfDay(now);
      const weekStart = startOfWeek(now);
      const monthStart = startOfMonth(now);

      const sales = await Movement.find({ type: 'salida' });
      const daily = sales.filter(s => new Date(s.createdAt) >= dayStart);
      const weekly = sales.filter(s => new Date(s.createdAt) >= weekStart);
      const monthly = sales.filter(s => new Date(s.createdAt) >= monthStart);

      const sum = (arr: any[]) => arr.reduce((acc, curr) => acc + curr.totalValue, 0);

      return {
        totalSales: sum(sales),
        count: sales.length,
        averageTicket: sales.length > 0 ? sum(sales) / sales.length : 0,
        dailySales: sum(daily),
        weeklySales: sum(weekly),
        monthlySales: sum(monthly)
      };
    },
    salesByMonth: async (_: unknown, __: unknown, context: GraphQLContext) => {
      checkRole(context, ['admin', 'consultor'] as any);
      const labels = [];
      const values = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        
        const monthlySales = await Movement.find({
          type: 'salida',
          createdAt: { $gte: start, $lte: end }
        });
        
        labels.push(format(date, 'MMM yyyy'));
        values.push(monthlySales.reduce((acc, curr) => acc + curr.totalValue, 0));
      }
      return { labels, values };
    },
    salesByCategory: async (_: unknown, __: unknown, context: GraphQLContext) => {
      checkRole(context, ['admin', 'consultor'] as any);
      const sales = await Movement.find({ type: 'salida' }).populate('product');
      const categories: { [key: string]: number } = {};
      
      sales.forEach((sale: any) => {
        const cat = sale.product.category || 'Sin Categoría';
        categories[cat] = (categories[cat] || 0) + sale.totalValue;
      });

      return {
        labels: Object.keys(categories),
        values: Object.values(categories)
      };
    },
    inventoryTrends: async (_: unknown, { productId }: { productId: string }, context: GraphQLContext) => {
      checkRole(context, ['admin', 'bodeguero'] as any);
      const history = await Kardex.find({ product: productId }).sort({ date: 1 }).limit(20);
      return {
        labels: history.map(h => format(new Date(h.date), 'dd/MM HH:mm')),
        values: history.map(h => h.stockAfter)
      };
    }
  },
  Mutation: {
    createMovement: async (
      _: unknown,
      args: CreateMovementInput,
      context: GraphQLContext
    ) => {
      const user = checkRole(context, ['admin', 'bodeguero', 'user'] as any);

      logOperation('createMovement', user, {
        productId: args.productId,
        type: args.type,
        quantity: args.quantity,
      });

      return registerMovement(args, user.id);
    },
  },
};