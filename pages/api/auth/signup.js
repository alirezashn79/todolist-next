import { connectToDB } from "@/configs/db-connection";
import { UserModel } from "@/models/User";
import { generateToken, hashPassword } from "@/utils/auth";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return;

  try {
    // ! get data body
    const { firstname, lastname, username, email, password } = req.body;

    // !    validation data
    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(422).json({ message: "data is not valid...!" });
    }

    // !    connect to database
    await connectToDB();

    // !  check user exist
    const user = await UserModel.findOne().or([{ username }, { email }]);

    if (user) {
      return res
        .status(409)
        .json({ message: "user already exist! please signin 🙂" });
    }

    // !    hash password
    const hashedPassword = await hashPassword(password);

    // !     generate token
    const token = generateToken({ email });

    // !  check user exist
    const users = await UserModel.find({});

    // !    create user
    await UserModel.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: users.length > 0 ? "USER" : "ADMIN",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        })
      )
      .status(201)
      .json({
        message: "User created successfully 🙂",
        data: { firstname, lastname, username, email },
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "unknown enternal server error =>", error });
  }
}
