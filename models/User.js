const { model, models, Schema } = require("mongoose");

const schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, minLength: 6 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model("User", schema);
