import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return;

  console.log(req.body);

  //   try {
  //     const { token } = req.cookies;
  //     console.log(req);

  //     if (!token) {
  //       return res.status(401).json({ message: "you are not login...!" });
  //     }

  //     const tokenPayload = verifyToken(token);

  //     if (!tokenPayload) {
  //       return res.status(401).json({ message: "you are not login...!" });
  //     }

  //     const { id } = req.body;

  //     await connectToDB();

  //     const user = await UserModel.findOne({ email: tokenPayload.email });

  //     let todo;
  //     if (user.role === "ADMIN") {
  //       todo = await TodoModel.findByIdAndDelete(id);
  //     } else {
  //       todo = await TodoModel.findOneAndDelete({ _id: id, user: user._id });
  //     }

  //     return res
  //       .status(200)
  //       .json({ message: "todo deleted successfully", data: todo });
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ message: "unknown enternal server error", error });
  //   }
}
