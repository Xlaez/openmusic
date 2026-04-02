import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITimedLyric {
  time: number
  text: string
}

export interface ITrack {
  title: string
  duration: number
  trackNumber: number
  lyrics?: string
  timedLyrics?: ITimedLyric[]
  fileUrl: string
}

export interface IProject extends Document {
  type: 'album' | 'ep' | 'mixtape' | 'single'
  title: string
  artist: Types.ObjectId
  coverImage: string
  releaseDate: Date
  price: number
  totalUnits: number
  availableUnits: number
  tracks: ITrack[]
  description?: string
  genres: string[]
  contractAddress?: string
  tokenId?: number
  createdAt: Date
  updatedAt: Date
}

const timedLyricSchema = new Schema<ITimedLyric>(
  {
    time: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
)

const trackSchema = new Schema<ITrack>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    trackNumber: { type: Number, required: true },
    lyrics: { type: String },
    timedLyrics: [timedLyricSchema],
    fileUrl: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
      },
    },
  },
)

const projectSchema = new Schema<IProject>(
  {
    type: { type: String, enum: ['album', 'ep', 'mixtape', 'single'], required: true },
    title: { type: String, required: true, index: 'text' },
    artist: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coverImage: { type: String, default: '' },
    releaseDate: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    totalUnits: { type: Number, required: true },
    availableUnits: { type: Number, required: true },
    tracks: [trackSchema],
    description: { type: String },
    genres: [{ type: String }],
    contractAddress: { type: String },
    tokenId: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        if (ret.releaseDate instanceof Date) {
          ret.releaseDate = ret.releaseDate.toISOString()
        }
        if (ret.createdAt instanceof Date) {
          ret.createdAt = ret.createdAt.toISOString()
        }
        return ret
      },
    },
  },
)

// Text index for search
projectSchema.index({ title: 'text', genres: 'text' })

export const Project = mongoose.model<IProject>('Project', projectSchema)
