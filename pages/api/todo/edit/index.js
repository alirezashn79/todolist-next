import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return;

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "you are not login...!" });
    }

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return res.status(401).json({ message: "you are not login...!" });
    }

    const { id, isComplete, title } = req.body;

    await connectToDB();

    const user = await UserModel.findOne({ email: tokenPayload.email });

    let todo;
    if (user.role === "ADMIN") {
      todo = await TodoModel.findByIdAndUpdate(id, {
        isComplete,
        title,
      });
    } else {
      todo = await TodoModel.findOneAndUpdate(
        { _id: id, user: user._id },
        {
          isComplete,
          title,
        }
      );
    }

    return res
      .status(200)
      .json({ message: "todo updated successfully", data: todo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "unknown enternal server error", error });
  }
}
