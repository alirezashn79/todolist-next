import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
  } else if (req.method === "POST") {
    try {
      const { title } = req.body;

      if (!title.trim()) {
        return res.status(422).json({ message: "data is not valid...!" });
      }

      // !    check token exist
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({ message: "You are not login...!" });
      }

      // !    verify token

      const tokenPayload = verifyToken(token);
      if (!tokenPayload) {
        return res.status(401).json({ message: "You are not login...!" });
      }

      // !    connect to database
      await connectToDB();

      // !    get user
      const user = await UserModel.findOne({ email: tokenPayload.email });

      // !    create data
      const todoData = {
        title,
        user: user._id,
      };

      await TodoModel.create(todoData);

      return res.status(201).json({ message: "Todo created successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unknown enternal server error...!", error });
    }
  } else {
    return;
  }
}
