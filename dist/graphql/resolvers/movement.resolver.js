"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movementResolver = void 0;
const movement_service_1 = require("../../services/movement.service");
const permissions_1 = require("../../utils/permissions");
const logger_middleware_1 = require("../../middlewares/logger.middleware");
const Movement_model_1 = __importDefault(require("../../models/Movement.model"));
const Kardex_model_1 = __importDefault(require("../../models/Kardex.model"));
const date_fns_1 = require("date-fns");
exports.movementResolver = {
    Query: {
        movements: async (_, { productId, type, userId, startDate, endDate }, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'bodeguero', 'consultor', 'user']);
            const filter = {};
            if (productId)
                filter.product = productId;
            if (type)
                filter.type = type;
            if (userId)
                filter.registeredBy = userId;
            if (startDate || endDate) {
                filter.createdAt = {};
                if (startDate)
                    filter.createdAt.$gte = new Date(startDate);
                if (endDate)
                    filter.createdAt.$lte = new Date(endDate);
            }
            return Movement_model_1.default.find(filter).populate('product registeredBy').sort({ createdAt: -1 });
        },
        kardex: async (_, { productId }, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'bodeguero', 'consultor', 'user']);
            const filter = productId ? { product: productId } : {};
            return Kardex_model_1.default.find(filter).populate('product movement').sort({ date: -1 });
        },
        salesStats: async (_, __, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'consultor']);
            const now = new Date();
            const dayStart = (0, date_fns_1.startOfDay)(now);
            const weekStart = (0, date_fns_1.startOfWeek)(now);
            const monthStart = (0, date_fns_1.startOfMonth)(now);
            const sales = await Movement_model_1.default.find({ type: 'salida' });
            const daily = sales.filter(s => new Date(s.createdAt) >= dayStart);
            const weekly = sales.filter(s => new Date(s.createdAt) >= weekStart);
            const monthly = sales.filter(s => new Date(s.createdAt) >= monthStart);
            const sum = (arr) => arr.reduce((acc, curr) => acc + curr.totalValue, 0);
            return {
                totalSales: sum(sales),
                count: sales.length,
                averageTicket: sales.length > 0 ? sum(sales) / sales.length : 0,
                dailySales: sum(daily),
                weeklySales: sum(weekly),
                monthlySales: sum(monthly)
            };
        },
        salesByMonth: async (_, __, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'consultor']);
            const labels = [];
            const values = [];
            for (let i = 5; i >= 0; i--) {
                const date = (0, date_fns_1.subMonths)(new Date(), i);
                const start = (0, date_fns_1.startOfMonth)(date);
                const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
                const monthlySales = await Movement_model_1.default.find({
                    type: 'salida',
                    createdAt: { $gte: start, $lte: end }
                });
                labels.push((0, date_fns_1.format)(date, 'MMM yyyy'));
                values.push(monthlySales.reduce((acc, curr) => acc + curr.totalValue, 0));
            }
            return { labels, values };
        },
        salesByCategory: async (_, __, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'consultor']);
            const sales = await Movement_model_1.default.find({ type: 'salida' }).populate('product');
            const categories = {};
            sales.forEach((sale) => {
                const cat = sale.product.category || 'Sin Categoría';
                categories[cat] = (categories[cat] || 0) + sale.totalValue;
            });
            return {
                labels: Object.keys(categories),
                values: Object.values(categories)
            };
        },
        inventoryTrends: async (_, { productId }, context) => {
            (0, permissions_1.checkRole)(context, ['admin', 'bodeguero']);
            const history = await Kardex_model_1.default.find({ product: productId }).sort({ date: 1 }).limit(20);
            return {
                labels: history.map(h => (0, date_fns_1.format)(new Date(h.date), 'dd/MM HH:mm')),
                values: history.map(h => h.stockAfter)
            };
        }
    },
    Mutation: {
        createMovement: async (_, args, context) => {
            const user = (0, permissions_1.checkRole)(context, ['admin', 'bodeguero', 'user']);
            (0, logger_middleware_1.logOperation)('createMovement', user, {
                productId: args.productId,
                type: args.type,
                quantity: args.quantity,
            });
            return (0, movement_service_1.registerMovement)(args, user.id);
        },
    },
};
