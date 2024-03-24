import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";
import { generateToken, verifyPassword } from "@/utils/auth";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return;
  try {
    // !    get data body
    const { identifier, password } = req.body;

    // !    validation data
    if (!identifier.trim() || !password.trim()) {
      return res.status(422).json({ message: "data is not valid...!" });
    }

    // !    connect to database
    await connectToDB();

    // !    check user exist
    const user = await UserModel.findOne().or([
      { username: identifier },
      { email: identifier },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found...!" });
    }

    // !    verifyPassword
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res
        .status(422)
        .json({ message: "Username or password is not valid...!" });
    }

    // !    generate token
    const token = generateToken({ email: user.email });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        })
      )
      .status(200)
      .json({
        message: "User signed in successfully 🙂",
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unknown enternal server error", error });
  }
}
