import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  privyId: string
  walletAddress: string
  role: 'listener' | 'artist'
  username: string
  displayName?: string
  bio?: string
  email?: string
  avatar?: string
  coverImage?: string
  verified: boolean
  balance: {
    usdc: number
    usdt: number
  }
  stats: {
    totalSales: number
    totalListeners: number
    projectsReleased: number
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    privyId: { type: String, unique: true, sparse: true, index: true },
    walletAddress: { type: String, index: true, default: '' },
    role: { type: String, enum: ['listener', 'artist'], default: 'listener' },
    username: { type: String, unique: true, sparse: true },
    displayName: { type: String },
    bio: { type: String },
    email: { type: String },
    avatar: { type: String },
    coverImage: { type: String },
    verified: { type: Boolean, default: false },
    balance: {
      usdc: { type: Number, default: 0 },
      usdt: { type: Number, default: 0 },
    },
    stats: {
      totalSales: { type: Number, default: 0 },
      totalListeners: { type: Number, default: 0 },
      projectsReleased: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.privyId
        if (ret.createdAt instanceof Date) {
          ret.createdAt = ret.createdAt.toISOString()
        }
        if (ret.updatedAt instanceof Date) {
          ret.updatedAt = ret.updatedAt.toISOString()
        }
        return ret
      },
    },
  },
)

export const User = mongoose.model<IUser>('User', userSchema)
