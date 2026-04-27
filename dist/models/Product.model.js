"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    stock: { type: Number, required: true, default: 0, min: 0 },
    minStock: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String },
    active: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Product', productSchema);
