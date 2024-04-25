import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return;

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "you are not login...!" });
    }

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return res.status(401).json({ message: "you are not login...!" });
    }

    await connectToDB();

    const user = await UserModel.findOne()
      .where({ email: tokenPayload.email })
      .select("role");

    if (!user) {
      return res.status().json({ message: "you are not login...!" });
    }

    if (user.role !== "ADMIN") {
      return res
        .status(405)
        .json({ message: "you are not allowed to access to this route...!" });
    }
    const { id } = req.query;

    await UserModel.findByIdAndDelete(id);
    await TodoModel.deleteMany().where({ user: id });

    return res.status(200).json({ message: "user removed successfully :))" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "unknown internal server error...!", error });
  }
}
