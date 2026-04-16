import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPlaylistTrack {
  project: Types.ObjectId
  trackIndex: number
}

export interface IPlaylist extends Document {
  name: string
  user: Types.ObjectId
  tracks: IPlaylistTrack[]
  coverImage?: string
  createdAt: Date
  updatedAt: Date
}

const playlistTrackSchema = new Schema<IPlaylistTrack>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    trackIndex: { type: Number, required: true },
  },
  { _id: false },
)

const playlistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tracks: [playlistTrackSchema],
    coverImage: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString()
        ret.userId = ret.user?.toString() || ret.userId
        delete ret._id
        delete ret.__v
        delete ret.user
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

export const Playlist = mongoose.model<IPlaylist>('Playlist', playlistSchema)
