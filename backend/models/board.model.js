const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled board",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    elements: {
      type: Array,
      default: [], // persisted canvas state
    },

    thumbnail: {
      type: String, // optional, placeholder or base64 later
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
