import { connectToDB } from "@/configs/db-connection";
import { TodoModel } from "@/models/Todo";
import { UserModel } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  // ! get request query
  const { id } = req.query;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "can not find todo...!" });
  }

  // !   get toke from request
  const { token } = req.cookies;

  // !   check token exist is cookies
  if (!token) {
    return res.status(401).json({ message: "you are not login...!" });
  }

  // !   encode token
  const tokenpayload = verifyToken(token);

  // !    check token is valid
  if (!tokenpayload) {
    return res.status(401).json({ message: "you are not login" });
  }

  // ! connect to database
  await connectToDB();

  // !    check user is allow to delete todo
  const user = await UserModel.findOne({ email: tokenpayload.email }, "role");

  if (!user) {
    return res.status(401).json({ message: "user not found...!" });
  }

  if (req.method === "DELETE") {
    try {
      let removedTodo;
      // ! check user role
      if (user.role === "ADMIN") {
        removedTodo = await TodoModel.findByIdAndDelete(id);
      } else if (user.role === "USER") {
        removedTodo = await TodoModel.findOneAndDelete({
          _id: id,
          user: user._id,
        });
      }

      return res.status(200).json({ message: "Todo removed successfully :))" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "unknown enternal server error", error });
    }
  } else if (req.method === "PATCH") {
    try {
      const { title, isComplete } = req.body;

      if (!title.trim()) {
        return res.status(422).json({ message: "data is not valid...!" });
      }

      let updatedTodo;
      switch (user.role) {
        case "ADMIN": {
          updatedTodo = await TodoModel.findByIdAndUpdate(id, {
            title,
            isComplete,
          });
          break;
        }
        case "USER": {
          updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: id, user: user._id },
            {
              title,
              isComplete,
            }
          );
          break;
        }

        default:
          break;
      }

      return res
        .status(200)
        .json({ message: "Todo updated successfully :))", data: updatedTodo });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "unknown enternal server error", error });
    }
  } else return;
}
