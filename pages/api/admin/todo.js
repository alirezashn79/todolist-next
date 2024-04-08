import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return;

  try {
    // ! check token
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "you are not login" });
    }

    // !  verify token
    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return res.status(401).json({ message: "You are not login" });
    }

    // ! connect to database
    await connectToDB();

    const user = await UserModel.findOne({ email: tokenPayload.email }, "role");

    if (!user) {
      return res.status(404).json({ message: "user not found...!" });
    }

    if (user.role !== "ADMIN") {
      return res.status(401).json({
        message: "you is not allow to define todo for other users...!",
      });
    }

    const { title, userId, isComplete } = req.body;

    const todo = await TodoModel.create({
      title,
      user: userId,
      isComplete,
      writer: "ADMIN",
    });

    return res
      .status(201)
      .json({ message: "todo created successfully by admin :))", data: todo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown enternal server error...!", error });
  }
}
