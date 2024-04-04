import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") return;

  return res
    .status(200)
    .setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      })
    )
    .json({ message: "user logout successfully ❤" });
}
