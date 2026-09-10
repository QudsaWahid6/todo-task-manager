const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["TODO", "IN PROGRESS", "NEED DECISION", "DONE"],
      default: "TODO",
    },

    file: {
      originalName: {
        type: String,
        default: null,
      },

      fileName: {
        type: String,
        default: null,
      },

      path: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
