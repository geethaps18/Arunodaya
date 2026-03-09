import mongoose, { Schema, Document } from "mongoose";

export interface IOfferRule {
  minQty: number;
  maxQty: number;
  discountType: "CASH" | "PERCENT" | "PRODUCT";
  pricePerUnit?: number;
  percentOff?: number;

  freeProductConfig?: {
    categories: mongoose.Types.ObjectId[];
    brands: mongoose.Types.ObjectId[];
    freeQty: number;
  };
}

export interface IVariant {
  name: string;
  sku?: string;
  basePrice: number;
  offers: IOfferRule[];
}

export interface IProduct extends Document {
  name: string;
  category?: string;
  variants: IVariant[];
}

const OfferRuleSchema = new Schema<IOfferRule>({
  minQty: { type: Number, required: true },
  maxQty: { type: Number, required: true },

  discountType: {
    type: String,
    enum: ["CASH", "PERCENT", "PRODUCT"],
    required: true,
  },

  pricePerUnit: Number,
  percentOff: Number,

  freeProductConfig: {
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    freeQty: Number,
  },
});

const VariantSchema = new Schema<IVariant>({
  name: String,
  sku: String,
  basePrice: Number,
  offers: [OfferRuleSchema],
});

const ProductSchema = new Schema<IProduct>({
  name: String,
  category: String,
  variants: [VariantSchema],
});

const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;