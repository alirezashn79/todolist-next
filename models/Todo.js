const { model, models, Schema, Types } = require("mongoose");
import "./User";
const schema = new Schema(
  {
    title: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    user: { type: Types.ObjectId, ref: "User", required: true },
    writer: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  {
    timestamps: true,
  }
);

export const TodoModel = models.Todo || model("Todo", schema);
