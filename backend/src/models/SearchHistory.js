import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lifeEvent: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
