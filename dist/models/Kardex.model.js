"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kardexSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    movement: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Movement', required: true },
    type: { type: String, enum: ['entrada', 'salida'], required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    stockBefore: { type: Number, required: true },
    stockAfter: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Kardex', kardexSchema);
