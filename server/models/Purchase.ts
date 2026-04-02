import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPurchase extends Document {
  project: Types.ObjectId
  buyer: Types.ObjectId
  price: number
  txHash?: string
  tokenId?: number
  createdAt: Date
  updatedAt: Date
}

const purchaseSchema = new Schema<IPurchase>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price: { type: Number, required: true },
    txHash: { type: String },
    tokenId: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        ret.purchaseDate = ret.createdAt instanceof Date ? ret.createdAt.toISOString() : ret.createdAt
        delete ret._id
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
  },
)

// Compound index for querying purchases by buyer and project
purchaseSchema.index({ buyer: 1, project: 1 })
purchaseSchema.index({ createdAt: -1 })

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema)
