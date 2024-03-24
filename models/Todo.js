const { model, models, Schema } = require("mongoose");
import "./User";
const schema = new Schema(
  {
    title: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const TodoModel = models.Todo || model("Todo", schema);
