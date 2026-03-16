import mongoose from "mongoose";

const schema=new mongoose.Schema({
rank: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  appId: {
    type: Number,
    required: true,
    unique: true
  },
  developer: {
    type: String
  },
  publisher: {
    type: String
  },
  genres: {
    type: [String]
  },
  playerCount: {
    type: Number
  },
  popularity: {
    type: String
  },
  rating: {
    type: String
  },
  totalReviews: {
    type: Number
  },
  price: {
    type: String
  },
  photo: {
    type: String
  },
  url: {
    type: String
  }
}, { timestamps: true });

const game = mongoose.models.game || mongoose.model('game',schema)

export default game;