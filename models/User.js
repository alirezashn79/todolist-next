const { model, models, Schema } = require("mongoose");

const schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model("User", schema);
